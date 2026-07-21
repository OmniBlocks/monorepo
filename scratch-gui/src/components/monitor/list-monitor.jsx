import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { FormattedMessage } from "react-intl";
import styles from "./monitor.css";
import ListMonitorScroller from "./list-monitor-scroller.jsx";
import { darken } from "polished";

const ListMonitor = ({
    draggable,
    label,
    width,
    height,
    value,
    onResizeMouseDown,
    onAdd,
    categoryColor,
    ...rowProps
}) => {
    // Detect if the value is a uniform 2D array (table)
    const is2DArray =
        Array.isArray(value) && value.length > 0 && value.every(Array.isArray);

    return (
        <div
            className={styles.listMonitor}
            style={{
                width: `${width}px`,
                height: `${height}px`,
            }}
        >
            <div className={styles.listHeader}>{label}</div>
            <div className={(styles.listBody, "no-drag")}>
                {is2DArray ? (
                    // Render 2D array as a table
                    <div style={{ overflowX: "auto", height: height - 42 }}>
                        <table
                            style={{
                                borderCollapse: "collapse",
                                width: "100%",
                            }}
                        >
                            <tbody>
                                {value.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                        {row.map((cell, cIdx) => (
                                            <td
                                                key={cIdx}
                                                style={{
                                                    border: "1px solid #ccc",
                                                    padding: "4px 8px",
                                                    background: darken(
                                                        0.05,
                                                        categoryColor.background,
                                                    ),
                                                    color: categoryColor.text,
                                                }}
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // Normal list / nested arrays use the existing scroller
                    <ListMonitorScroller
                        draggable={draggable}
                        height={height}
                        values={value}
                        width={width}
                        categoryColor={categoryColor}
                        {...rowProps}
                    />
                )}
            </div>
            <div className={styles.listFooter}>
                {/* <div
                    className={classNames(draggable ? styles.addButton : null, 'no-drag')}
                    onClick={draggable ? onAdd : null}
                >
                    {'+' /* TODO waiting on asset * /}
                </div> */}
                <div className={styles.footerLength}>
                    <FormattedMessage
                        defaultMessage="length {length}"
                        description="Length label on list monitors. DO NOT translate {length} (with brackets)."
                        id="gui.monitor.listMonitor.listLength"
                        values={{
                            length: Array.isArray(value) ? value.length : 0,
                        }}
                    />
                </div>
                <div
                    className={classNames(
                        draggable ? styles.resizeHandle : null,
                        "no-drag",
                    )}
                    onPointerDown={draggable ? onResizeMouseDown : null}
                >
                    {"=" /* TODO waiting on asset */}
                </div>
            </div>
        </div>
    );
};

ListMonitor.propTypes = {
    activeIndex: PropTypes.number,
    categoryColor: PropTypes.shape({
        background: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    }).isRequired,
    draggable: PropTypes.bool.isRequired,
    height: PropTypes.number,
    label: PropTypes.string.isRequired,
    onActivate: PropTypes.func,
    onAdd: PropTypes.func,
    onResizeMouseDown: PropTypes.func,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
                PropTypes.array,
            ]),
        ),
    ]),
    width: PropTypes.number,
};

ListMonitor.defaultProps = {
    width: 110,
    height: 200,
};

export default ListMonitor;
