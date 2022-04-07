import React from 'react';

export default (props) => {
    const cellValue = props.value;
    if (cellValue.link) {
        return <a href={cellValue.link}>{cellValue.text}</a>;
    } else {
        return <span>{cellValue.text}</span>;
    }
};
