import { addUserMessage, emitUserMessage } from 'actions';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { PROP_TYPES } from 'constants';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import LinkCellRenderer from './linkCellRenderer';
import './styles.scss';

const CustomDataTable = (props) => {
    const customDataTable = props.message.toJS();

    const gridOptions = {
        suppressMenuHide: true,
    };

    const columnTypes = {
        link: {
            cellRenderer: LinkCellRenderer,
            comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
                if (valueA.text == valueB.text) return 0;
                return valueA.text > valueB.text ? 1 : -1;
            },
            filter: 'agTextColumnFilter',
            filterParams: {
                suppressAndOrCondition: true,
                filterOptions: [
                    'contains',
                    'notContains',
                    'equals',
                    'notEqual',
                    'startsWith',
                    'endsWith',
                ],
                textFormatter: (value) => {
                    return value;
                },
                textMatcher: ({ filterOption, value, filterText }) => {
                    const filterTextLowerCase = filterText.toLowerCase();
                    const valueLowerCase = value.text.toLowerCase();
                    switch (filterOption) {
                        case 'contains':
                            return valueLowerCase.indexOf(filterTextLowerCase) >= 0;
                        case 'notContains':
                            return valueLowerCase.indexOf(filterTextLowerCase) === -1;
                        case 'equals':
                            return valueLowerCase === filterTextLowerCase;
                        case 'notEqual':
                            return valueLowerCase != filterTextLowerCase;
                        case 'startsWith':
                            return valueLowerCase.indexOf(filterTextLowerCase) === 0;
                        case 'endsWith':
                            var index = valueLowerCase.lastIndexOf(filterTextLowerCase);
                            return (
                                index >= 0 &&
                                index === valueLowerCase.length - filterTextLowerCase.length
                            );
                        default:
                            // should never happen
                            console.warn('invalid filter type ' + filterOption);
                            return false;
                    }
                },
            },
        },
        date: {
            comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
                var timeA = new Date(valueA).getTime();
                var timeB = new Date(valueB).getTime();
                if (timeA == timeB) return 0;
                return timeA > timeB ? 1 : -1;
            },
        },
    };

    const defaultColumnDefs = {
        flex: 1,
    };

    return (
        <React.Fragment>
            <div className="rw-data-table-wrapper">
                <div className="rw-data-table-container ag-theme-alpine">
                    <AgGridReact
                        columnDefs={customDataTable.columns}
                        defaultColDef={defaultColumnDefs}
                        columnTypes={columnTypes}
                        rowData={customDataTable.elements}
                        pagination={customDataTable.pagination}
                        paginationPageSize={customDataTable.pageSize}
                        gridOptions={gridOptions}
                    ></AgGridReact>
                </div>
                <div className="rw-data-table-notes">{customDataTable.notes}</div>
            </div>
        </React.Fragment>
    );
};

CustomDataTable.propTypes = {
    message: PROP_TYPES.CUSTOM_DATA_TABLE,
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomDataTable);
