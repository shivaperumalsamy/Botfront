import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import close from 'assets/clear-button.svg';
import fullscreen from 'assets/fullscreen_button.svg';
import fullscreenExit from 'assets/fullscreen_exit_button.svg';
import unmuteTone from 'assets/unmute-tone.png';
import muteTone from 'assets/mute-tone.png';
import logo from 'assets/logo.png';
import './style.scss';
import ThemeContext from '../../../../ThemeContext';

const Header = ({
    title,
    subtitle,
    fullScreenMode,
    toggleFullScreen,
    toggleChat,
    showCloseButton,
    showFullScreenButton,
    messageToneMode,
    toggleMessageTone,
    enableMessageTone,
    connected,
    connectingText,
    closeImage,
    profileAvatar,
}) => {
    const { mainColor } = useContext(ThemeContext);
    return (
        <div className="rw-header-and-loading">
            <div
                style={{ backgroundColor: mainColor }}
                className={`rw-header ${subtitle ? 'rw-with-subtitle' : ''}`}
            >
                <img src={logo} className="rw-avatar" alt="chat avatar" />
                <div className="rw-header-buttons">
                    {enableMessageTone && (
                        <button className="rw-toggle-fullscreen-button" onClick={toggleMessageTone}>
                            <img
                                className={`rw-toggle-fullscreen ${
                                    messageToneMode
                                        ? 'rw-fullScreenExitImage'
                                        : 'rw-fullScreenImage'
                                }`}
                                src={messageToneMode ? unmuteTone : muteTone}
                                alt="toggle message tone"
                            />
                        </button>
                    )}
                    {showFullScreenButton && (
                        <button className="rw-toggle-fullscreen-button" onClick={toggleFullScreen}>
                            <img
                                className={`rw-toggle-fullscreen ${
                                    fullScreenMode ? 'rw-fullScreenExitImage' : 'rw-fullScreenImage'
                                }`}
                                src={fullScreenMode ? fullscreenExit : fullscreen}
                                alt="toggle fullscreen"
                            />
                        </button>
                    )}
                    {showCloseButton && (
                        <button className="rw-close-button" onClick={toggleChat}>
                            <img
                                className={`rw-close ${closeImage ? '' : 'rw-default'}`}
                                src={closeImage || close}
                                alt="close"
                            />
                        </button>
                    )}
                </div>
                <h4 className={`rw-title ${profileAvatar && 'rw-with-avatar'}`}>{title}</h4>
                {subtitle && <span className={profileAvatar && 'rw-with-avatar'}>{subtitle}</span>}
            </div>
            {!connected && <span className="rw-loading">{connectingText}</span>}
        </div>
    );
};

Header.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    fullScreenMode: PropTypes.bool,
    toggleFullScreen: PropTypes.func,
    toggleChat: PropTypes.func,
    showCloseButton: PropTypes.bool,
    showFullScreenButton: PropTypes.bool,
    enableMessageTone: PropTypes.bool,
    toggleMessageTone: PropTypes.func,
    messageToneMode: PropTypes.bool,
    connected: PropTypes.bool,
    connectingText: PropTypes.string,
    closeImage: PropTypes.string,
    profileAvatar: PropTypes.string,
};

export default Header;
