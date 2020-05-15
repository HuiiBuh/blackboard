class Parser {
    constructor() {
    }

    static replaceVariables(string, json) {
        const start = new RegExp('{{', 'gi');
        const end = new RegExp('}}', 'gi');

        let startIndex, endIndex;

        while (1) {
            startIndex = start.exec(string);
            endIndex = end.exec(string);

            if (!startIndex || !endIndex) {
                break;
            }
            startIndex = startIndex.index;
            endIndex = endIndex.index;

            const replaceJSON = {
                string: string.slice(startIndex + 2, endIndex).trim().split('.'),
                start: startIndex,
                end: endIndex + 2,
            };

            string = Parser._replace(replaceJSON, json, string);
        }

        return string;
    }

    static _replace(replaceJSON, json, string) {
        const value = Parser.getVariableValue(replaceJSON.string, json);

        const s = string.substring(0, replaceJSON.start);
        const e = string.slice(replaceJSON.end);

        string = s + value + e;
        return string;
    }

    static getVariableValue(stringList, json) {
        let returnValue = json;
        for (let stringIndex of stringList) {
            returnValue = returnValue[stringIndex];
        }

        return returnValue;
    }
}
