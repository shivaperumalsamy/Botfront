import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export default (props) => {
    const cellValue = props.value;
    if (cellValue.link) {
        return (
            <a href={cellValue.link} target="_blank" rel="noopener noreferrer">
                {cellValue.text}
            </a>
        );
    } else {
        return (
            <span>
                {cellValue.icon && (
                    <FontAwesomeIcon icon={cellValue.icon.name} style={cellValue.icon.style} />
                )}
                {' ' + cellValue.text}
            </span>
        );
    }
};
