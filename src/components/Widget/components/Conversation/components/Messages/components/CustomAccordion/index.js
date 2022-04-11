import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import { addUserMessage, emitUserMessage } from 'actions';
import { PROP_TYPES } from 'constants';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const CustomAccordion = (props) => {
    const customAccordion = props.message.toJS();
    const [expanded, setExpanded] = useState();

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <React.Fragment>
            <div className="rw-accordion-container">
                {customAccordion.elements.map((element, index) => {
                    return (
                        <Accordion
                            expanded={expanded === `panel${index + 1}`}
                            onChange={handleChange(`panel${index + 1}`)}
                            key={index + 1}
                        >
                            <AccordionSummary
                                aria-controls={`panel${index + 1}d-content`}
                                id={`panel${index + 1}d-header`}
                            >
                                <Typography>{element.title}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ReactMarkdown
                                    className={'rw-markdown'}
                                    source={element.body}
                                    linkTarget={(url) => {
                                        if (
                                            !url.startsWith('mailto') &&
                                            !url.startsWith('javascript')
                                        )
                                            return '_blank';
                                        return undefined;
                                    }}
                                    transformLinkUri={null}
                                    renderers={{
                                        link: (props) => (
                                            <a
                                                href={props.href}
                                                target={linkTarget || '_blank'}
                                                rel="noopener noreferrer"
                                                onMouseUp={(e) => e.stopPropagation()}
                                            >
                                                {props.children}
                                            </a>
                                        ),
                                    }}
                                />
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </div>
        </React.Fragment>
    );
};

CustomAccordion.propTypes = {
    message: PROP_TYPES.CUSTOM_ACCORDION,
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomAccordion);
