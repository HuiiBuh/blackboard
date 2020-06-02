class Parser {
    /**
     * Take a string, parse is with the variables and insert it at a specific point
     * @param string The input string
     * @param variables The variables in a json with the variable name as key
     * @param querySelector The point the parsed string should be inserted (first element found)
     * @return The html element
     */
    insertAt(string, variables, querySelector) {
        const root = document.querySelector(querySelector);
        root.innerHTML = this.parseDocument(string, variables);
        return root.firstElementChild;
    }
    /**
     * Take a string and parse is with the variables
     * @param string The input string
     * @param variables The variables in the json which can be parsed
     */
    parseDocument(string, variables) {
        string = this._replaceForLoop(string, variables);
        return this._replaceVariables(string, variables);
    }
    /**
     * Replaces the created for loop
     * @param string
     * @param variables
     */
    _replaceForLoop(string, variables) {
        const start = new RegExp('{% +for [a-zA-Z_]+ +in +[a-zA-Z._]+ +%}');
        const end = new RegExp('{% +endfor +%}');
        let startIndex, endIndex;
        while (1) {
            startIndex = start.exec(string);
            endIndex = end.exec(string);
            if (!startIndex || !endIndex) {
                break;
            }
            // Get only the relevant loop string
            let loopString = string.substring(startIndex.index, endIndex.index);
            // Extract the variables from the for loop
            const [loopName, variable, relevantString] = this._extractVariables(loopString);
            // Get the value of the variable out of the for loop
            const variableValue = this._getVariableValue(variable, variables);
            // Construct the updated variables json
            const vJSON = Object.assign({}, variables);
            let updatedLoopString = '';
            for (let v of variableValue) {
                // Update the for loop variable in the json
                vJSON['' + loopName] = v;
                updatedLoopString += this._replaceVariables(relevantString, vJSON);
            }
            const s = string.substring(0, startIndex.index);
            const e = string.substring(endIndex.index + endIndex[0].length);
            string = s + updatedLoopString + e;
        }
        return string;
    }
    /**
     * Extract the variables out of the for loop declaration
     * @param string
     */
    _extractVariables(string) {
        const startIndex = /{%/.exec(string).index + 2;
        const endIndex = /%}/.exec(string).index;
        let mutatedString = string.substring(startIndex, endIndex);
        mutatedString = mutatedString.replace('for', '').replace('in', '');
        mutatedString = mutatedString.replace(/ +/g, ' ').trim();
        let [loopName, variableName] = mutatedString.split(' ');
        const variableNameList = variableName.split('.');
        return [loopName, variableNameList, string.slice(endIndex + 2)];
    }
    /**
     * Replace the variables in the template string
     * @param string The template string
     * @param variables A json with the variable name as key of the json
     * @returns The parsed string
     */
    _replaceVariables(string, variables) {
        // Regex for the start end end variable expression
        const start = new RegExp('{{', 'gi');
        const end = new RegExp('}}', 'gi');
        let startIndex, endIndex;
        // Replace the variables until the start end end does not match
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
            string = this._replace(replaceJSON, variables, string);
        }
        return string;
    }
    /**
     * Do the actual replacing of the string
     * @param replaceJSON A json which has all the information needed to to the replace action
     * @param variables The variables
     * @param string The string which should be parsed
     * @returns The parsed string
     */
    _replace(replaceJSON, variables, string) {
        const value = this._getVariableValue(replaceJSON.string, variables);
        const s = string.substring(0, replaceJSON.start);
        const e = string.slice(replaceJSON.end);
        string = s + value + e;
        return string;
    }
    /**
     * Get the variable value from the variable json
     * @param stringList A string of variable indices
     * @param variables The variable
     * @returns the variable value
     */
    _getVariableValue(stringList, variables) {
        let returnValue = variables;
        for (let stringIndex of stringList) {
            try {
                returnValue = returnValue[stringIndex];
            }
            catch (e) {
                throw new Error(`Your template is trying to access variables which do not exist\nVariable name: ${stringIndex}`);
            }
        }
        return returnValue;
    }
}
