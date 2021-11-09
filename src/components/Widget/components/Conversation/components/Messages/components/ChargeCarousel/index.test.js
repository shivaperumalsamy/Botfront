import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';

import { createChargeCarousel } from 'helper';
import { List } from 'immutable';

import Messages from '../../index';
import { initStore } from '../../../../../../../../store/store';
import LocalStorageMock from '../../../../../../../../../mocks/localStorageMock';

describe('</ChargeCarousel />', () => {
    const carousel = createChargeCarousel(
        {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    name: 'chargecard',
                    elements: [
                        {
                            sequence: '1',
                            offense: '53-3-202(1)(A) - NO VALID LICENSE - EXPIRED',
                            severity: 'Infraction',
                            offense_date: '07/25/2019',
                        },
                        {
                            sequence: '2',
                            offense: '53-3-202(1)(A) - NO VALID LICENSE - EXPIRED',
                            severity: 'Infraction',
                            offense_date: '07/25/2019',
                        },
                        {
                            sequence: '3',
                            offense: '53-3-202(1)(A) - NO VALID LICENSE - EXPIRED',
                            severity: 'Infraction',
                            offense_date: '07/25/2019',
                        },
                    ],
                },
            },
            text: 'undefined',
        },
        'response'
    );

    const responseMessage = List([carousel]);

    const localStorage = new LocalStorageMock();

    const store = initStore('dummy', 'dummy', localStorage);

    store.dispatch({
        type: 'CONNECT',
    });

    const messagesComponent = shallow(
        <Provider store={store}>
            <Messages.WrappedComponent messages={responseMessage} />
        </Provider>
    );

    it('should render a Carousel component and buttons and default actions', () => {
        expect(messagesComponent.render().find('.rw-carousel-card')).toHaveLength(3);
        expect(messagesComponent.render().find('a[href^="https://google"]')).toHaveLength(3);
        expect(messagesComponent.render().find('.rw-reply')).toHaveLength(3);

        expect(messagesComponent.render().find('.rw-reply[href^="https://facebook"]')).toHaveLength(
            1
        );
    });
});
