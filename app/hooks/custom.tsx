import { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import { Params } from "../lib/definitions";

export function useHTMLTable () {
    const [ rows, setRows ] = useState<Array<Array<{id: string, value: string}>>>([]);
    const columnLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    const handleInputChange = ({id, index, value}: {
        id: string,
        index: number,
        value: string,
    }) => {
        setRows(() => {
            return rows.map((row, i) => {
                if (i = index) {
                    return row.map(column => {
                        if (column.id === id) {
                            column.value = value;
                        }
                        return column;
                    })
                }
                return row;
            })
        })
    }
    
    const addRow = (value?: string) => {
        setRows(previous => {
            return [...previous,
                rows.length > 0 ? rows[rows.length - 1].map((_, index) => {
                    return {
                        id: `${columnLetters[index]}${rows.length}`,
                        value: value ? value : ''
                    }
                }) : [
                    {
                        id: `${columnLetters[rows.length]}${rows.length}`,
                        value: value ? value : ''
                    }
                ]
            ]
        });
    }

    const addColumn = (value?: string) => {
        setRows(() => {
            if (rows.length > 0) {
                return rows.map((row, index) => {
                    return [
                        ...row,
                        {
                            id: `${columnLetters[row.length]}${index}`,
                            value: value ? value : ''
                        }
                    ]
                })
            } else {
                return [[{
                    id: `${columnLetters[rows.length]}${rows.length}`,
                    value: value ? value : ''
                }]]
            }
        });
    }

    const removeRow = () => {
        setRows(() => {
            if (rows.length > 0) {
                return rows.slice(0, rows.length - 1);
            } else {
                return [];
            }
        })
    }

    const removeColumn = () => {
        setRows(() => {
            return rows.map(row => {
                if (row.length > 0) {
                    return row.slice(0, row.length - 1);
                }
                return row;
            })
        })
    }

    return {
        addRow,
        addColumn,
        removeRow,
        removeColumn,
        rows,
        handleInputChange,
    }
}

/*
{
    "command": "SELECT",
    "rowCount": 11,
    "oid": null,
    "rows": [
        {
            "_num": 0,
            "A0": "Name",
            "B0": "Schedule"
        },
        {
            "_num": 10,
            "A0": "Tania Rosales",
            "B0": "PT-3"
        },
        {
            "_num": 1,
            "A0": "Hugo Huante",
            "B0": "Full-time"
        },
        {
            "_num": 3,
            "A0": "José Solá",
            "B0": "PT-3"
        },
        {
            "_num": 8,
            "A0": "Carolina Chávez",
            "B0": "PT-3"
        },
        {
            "_num": 4,
            "A0": "Alberto Ávalos",
            "B0": "PT-3"
        },
        {
            "_num": 2,
            "A0": "Jorge Salas",
            "B0": "PT-2"
        },
        {
            "_num": 7,
            "A0": "David Gutiérrez",
            "B0": "PT-3"
        },
        {
            "_num": 6,
            "A0": "Camila Trejo",
            "B0": "PT-3"
        },
        {
            "_num": 9,
            "A0": "Miguel Parra",
            "B0": "PT-4"
        },
        {
            "_num": 5,
            "A0": "Axel González",
            "B0": "PT-4"
        }
    ],
    "fields": [
        {
            "name": "_num",
            "tableID": 33020,
            "columnID": 1,
            "dataTypeID": 23,
            "dataTypeSize": 4,
            "dataTypeModifier": -1,
            "format": "text"
        },
        {
            "name": "A0",
            "tableID": 33020,
            "columnID": 2,
            "dataTypeID": 1043,
            "dataTypeSize": -1,
            "dataTypeModifier": 34,
            "format": "text"
        },
        {
            "name": "B0",
            "tableID": 33020,
            "columnID": 3,
            "dataTypeID": 1043,
            "dataTypeSize": -1,
            "dataTypeModifier": 34,
            "format": "text"
        }
    ],
    "_parsers": [
        null,
        null,
        null
    ],
    "_types": {
        "_types": {
            "arrayParser": {},
            "builtins": {
                "BOOL": 16,
                "BYTEA": 17,
                "CHAR": 18,
                "INT8": 20,
                "INT2": 21,
                "INT4": 23,
                "REGPROC": 24,
                "TEXT": 25,
                "OID": 26,
                "TID": 27,
                "XID": 28,
                "CID": 29,
                "JSON": 114,
                "XML": 142,
                "PG_NODE_TREE": 194,
                "SMGR": 210,
                "PATH": 602,
                "POLYGON": 604,
                "CIDR": 650,
                "FLOAT4": 700,
                "FLOAT8": 701,
                "ABSTIME": 702,
                "RELTIME": 703,
                "TINTERVAL": 704,
                "CIRCLE": 718,
                "MACADDR8": 774,
                "MONEY": 790,
                "MACADDR": 829,
                "INET": 869,
                "ACLITEM": 1033,
                "BPCHAR": 1042,
                "VARCHAR": 1043,
                "DATE": 1082,
                "TIME": 1083,
                "TIMESTAMP": 1114,
                "TIMESTAMPTZ": 1184,
                "INTERVAL": 1186,
                "TIMETZ": 1266,
                "BIT": 1560,
                "VARBIT": 1562,
                "NUMERIC": 1700,
                "REFCURSOR": 1790,
                "REGPROCEDURE": 2202,
                "REGOPER": 2203,
                "REGOPERATOR": 2204,
                "REGCLASS": 2205,
                "REGTYPE": 2206,
                "UUID": 2950,
                "TXID_SNAPSHOT": 2970,
                "PG_LSN": 3220,
                "PG_NDISTINCT": 3361,
                "PG_DEPENDENCIES": 3402,
                "TSVECTOR": 3614,
                "TSQUERY": 3615,
                "GTSVECTOR": 3642,
                "REGCONFIG": 3734,
                "REGDICTIONARY": 3769,
                "JSONB": 3802,
                "REGNAMESPACE": 4089,
                "REGROLE": 4096
            }
        },
        "text": {},
        "binary": {}
    },
    "RowCtor": null,
    "rowAsArray": false,
    "_prebuiltEmptyResultObject": {
        "_num": null,
        "A0": null,
        "B0": null
    }
}
*/