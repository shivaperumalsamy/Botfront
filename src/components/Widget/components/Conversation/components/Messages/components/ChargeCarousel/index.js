import React, { useRef, useState, useContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addUserMessage, emitUserMessage } from 'actions';
import { PROP_TYPES } from 'constants';
import Arrow from 'assets/arrow';
import ThemeContext from '../../../../../../ThemeContext';

import './styles.scss';

const ChargeCarousel = (props) => {
    const carousel = props.message.toJS();
    const handleClick = (action) => {
        if (!action || action.type !== 'postback') return;
        const { chooseReply } = props;
        chooseReply(action.payload, action.title);
    };

    const scrollContainer = useRef();
    const [leftButton, setLeftButton] = useState(false);
    const [rightButton, setRightButton] = useState(true);
    const { mainColor, assistTextColor } = useContext(ThemeContext);

    const handleScroll = () => {
        const current = scrollContainer.current;
        if (current.scrollLeft > 0) {
            setLeftButton(true);
        } else {
            setLeftButton(false);
        }
        if (current.clientWidth === current.scrollWidth - current.scrollLeft) {
            setRightButton(false);
        } else {
            setRightButton(true);
        }
    };

    const handleLeftArrow = () => {
        scrollContainer.current.scrollTo({
            left: scrollContainer.current.scrollLeft - 230,
            behavior: 'smooth',
        });
    };

    const handleRightArrow = () => {
        scrollContainer.current.scrollTo({
            left: scrollContainer.current.scrollLeft + 230,
            behavior: 'smooth',
        });
    };

    const { linkTarget } = props;

    return (
        <React.Fragment>
            <div
                className="rw-carousel-container"
                ref={scrollContainer}
                onScroll={() => handleScroll()}
            >
                {carousel.elements.map((carouselCard, index) => {
                    return (
                        <div className="rw-carousel-card" key={index}>
                            <div className="rw-carousel-card-subtitle">
                                🔖 {'Case Offense Details'}
                            </div>
                            <div className="rw-hr-line"> </div>
                            <div className="rw-carousel-card-subtitle">{'Sequence'}</div>
                            <div className="rw-carousel-card-title">#️⃣ {carouselCard.sequence}</div>
                            <div className="rw-carousel-card-subtitle">{'Offense'}</div>
                            <div className="rw-carousel-card-title">{carouselCard.offense}</div>
                            <div className="rw-carousel-card-subtitle">{'Severity'}</div>
                            <div className="rw-carousel-card-title">🚩 {carouselCard.severity}</div>
                            <div className="rw-carousel-card-subtitle">{'Offense Date'}</div>
                            <div className="rw-carousel-card-title">
                                📅 {carouselCard.offense_date}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="rw-carousel-arrows-container">
                {leftButton && (
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                    <div
                        className="rw-left-arrow rw-carousel-arrow"
                        onClick={handleLeftArrow}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="rw-arrow" alt="left carousel arrow">
                            <Arrow />
                        </div>
                    </div>
                )}
                {rightButton && (
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                    <div
                        className="rw-right-arrow rw-carousel-arrow"
                        onClick={handleRightArrow}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="rw-arrow" alt="right carousel arrow">
                            <Arrow />
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

ChargeCarousel.propTypes = {
    message: PROP_TYPES.CHARGECAROUSEL,
    // completely bugged, it's actually used in handle click
    // eslint-disable-next-line react/no-unused-prop-types
    chooseReply: PropTypes.func.isRequired,
    linkTarget: PropTypes.string,
};

const mapStateToProps = (state) => ({
    linkTarget: state.metadata.get('linkTarget'),
});

const mapDispatchToProps = (dispatch) => ({
    chooseReply: (payload, title) => {
        if (title) dispatch(addUserMessage(title));
        dispatch(emitUserMessage(payload));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChargeCarousel);
