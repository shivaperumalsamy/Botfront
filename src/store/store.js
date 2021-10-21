import { createStore, combineReducers, compose, applyMiddleware } from 'redux';

import { SESSION_NAME } from 'constants';

import behavior from './reducers/behaviorReducer';
import messages from './reducers/messagesReducer';
import metadata from './reducers/metadataReducer';

import { getLocalSession } from './reducers/helper';
import * as actionTypes from './actions/actionTypes';
import { post } from '../utils/fetch';

const cleanURL = url => {
    const regexProtocolHostPort = /https?:\/\/(([A-Za-z0-9-])+(\.?))+[a-z]+(:[0-9]+)?/;
    const regexLastTrailingSlash = /\/$|\/(?=\?)/;
    return url.replace(regexProtocolHostPort, '').replace(regexLastTrailingSlash, '');
};

const trimQueryString = url => {
    const regexQueryString = /\?.+$/;
    return url.replace(regexQueryString, '');
};

function initStore(connectingText, socket, storage, docViewer = false, onWidgetEvent) {
    const customMiddleWare = store => next => action => {
        const localSession = getLocalSession(storage, SESSION_NAME);
        let sessionId = localSession ? localSession.session_id : null;
        if (!sessionId && socket.sessionId) {
            sessionId = socket.sessionId;
        }
        const emitMessage = payload => {
            const emit = () => {
                const accessToken = sessionStorage.getItem('ACCESS_TOKEN') || null;
                if (accessToken) {
                    socket.emit('user_uttered', {
                        message: payload,
                        customData: { accessToken },
                        session_id: sessionId,
                    });
                } else {
                    if (socket.customData.auth.url.length > 0) {
                        post(socket.customData.auth.url, {
                            userId: socket.customData.auth.parameters.userId,
                            userName: socket.customData.auth.parameters.userName,
                        }).then(response => {
                            socket.customData.auth['token'] =
                                response.token ||
                                'QBqa5nInszTruDUQayoEokoF08jW%2FnK6YhM55BahiyQRO2NkM6oSlvIBC%2Bio6iCznxH11lucohTi%0D%0ArWN4FbU6PeYqOIRd4PNeDXuhk%2FXNDpN4C1o9p88saGEu%2BctB%2Bhh6Fjdgw60AyudMD8Kl45JUNR%2BC%0D%0AOMIfyyJ4yIOBqCcuGtlSXyw2kjM2NfH48TIEQVEh05POk7Z3IMHaDOHiSWs05pqVJxPVL2Sq5FX4%0D%0AjZ97hZ3XFwzEd9gHJn5d0v3nfFShVq6IxqyFy3Gmr%2Bbc8f6M8nq99XUGAAb7tonMjSDyACo%3D';

                            socket.emit('user_uttered', {
                                message: payload,
                                customData: socket.customData,
                                session_id: sessionId,
                            });
                        });
                    } else {
                        socket.customData.auth['token'] =
                            'QBqa5nInszTruDUQayoEokoF08jW%2FnK6YhM55BahiyQRO2NkM6oSlvIBC%2Bio6iCznxH11lucohTi%0D%0ArWN4FbU6PeYqOIRd4PNeDXuhk%2FXNDpN4C1o9p88saGEu%2BctB%2Bhh6Fjdgw60AyudMD8Kl45JUNR%2BC%0D%0AOMIfyyJ4yIOBqCcuGtlSXyw2kjM2NfH48TIEQVEh05POk7Z3IMHaDOHiSWs05pqVJxPVL2Sq5FX4%0D%0AjZ97hZ3XFwzEd9gHJn5d0v3nfFShVq6IxqyFy3Gmr%2Bbc8f6M8nq99XUGAAb7tonMjSDyACo%3D';
                        socket.emit('user_uttered', {
                            message: payload,
                            customData: socket.customData,
                            session_id: sessionId,
                        });
                    }
                }
                store.dispatch({
                    type: actionTypes.ADD_NEW_USER_MESSAGE,
                    text: 'text',
                    nextMessageIsTooltip: false,
                    hidden: true,
                });
            };
            if (socket.sessionConfirmed) {
                emit();
            } else {
                socket.on('session_confirm', () => {
                    emit();
                });
            }
        };
        switch (action.type) {
            case actionTypes.EMIT_NEW_USER_MESSAGE: {
                emitMessage(action.text);
                break;
            }
            case actionTypes.GET_OPEN_STATE: {
                return store.getState().behavior.get('isChatOpen');
            }
            case actionTypes.GET_VISIBLE_STATE: {
                return store.getState().behavior.get('isChatVisible');
            }
            case actionTypes.GET_FULLSCREEN_STATE: {
                return store.getState().behavior.get('fullScreenMode');
            }
            case actionTypes.EVAL_URL: {
                const pageCallbacks = store.getState().behavior.get('pageChangeCallbacks');
                const pageCallbacksJs = pageCallbacks ? pageCallbacks.toJS() : {};

                const newUrl = action.url;

                if (!pageCallbacksJs.pageChanges) break;

                if (store.getState().behavior.get('oldUrl') !== newUrl) {
                    const { pageChanges, errorIntent } = pageCallbacksJs;
                    const matched = pageChanges.some(callback => {
                        if (callback.regex) {
                            if (newUrl.match(callback.url)) {
                                emitMessage(callback.callbackIntent);
                                return true;
                            }
                        } else {
                            let cleanCurrentUrl = cleanURL(newUrl);
                            let cleanCallBackUrl = cleanURL(callback.url);
                            if (!cleanCallBackUrl.match(/\?.+$/)) {
                                // the callback does not have a querystring
                                cleanCurrentUrl = trimQueryString(cleanCurrentUrl);
                                cleanCallBackUrl = trimQueryString(cleanCallBackUrl);
                            }
                            if (cleanCurrentUrl === cleanCallBackUrl) {
                                emitMessage(callback.callbackIntent);
                                return true;
                            }
                            return false;
                        }
                    });
                    if (!matched) emitMessage(errorIntent);
                }
                break;
            }
            default: {
                break;
            }
        }
        // console.log('Middleware triggered:', action);
        next(action);
    };
    const reducer = combineReducers({
        behavior: behavior(connectingText, storage, docViewer, onWidgetEvent),
        messages: messages(storage),
        metadata: metadata(storage),
    });

    // eslint-disable-next-line no-underscore-dangle
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    return createStore(reducer, composeEnhancer(applyMiddleware(customMiddleWare)));
}

export { initStore };
