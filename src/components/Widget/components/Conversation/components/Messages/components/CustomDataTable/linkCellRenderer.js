import React from 'react';

export default (props) => {
    const cellValue = props.value;
    return <a href={cellValue.link}>{cellValue.text}</a>;
};
