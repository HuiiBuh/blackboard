class Parser {

    /**
     * Take a string, parse is with the variables and insert it at a specific point
     * @param string The input string
     * @param variables The variables in a json with the variable name as key
     * @param querySelector The point the parsed string should be inserted (first element found)
     * @return The created html element
     */
    public insertAt(string: string, variables: object, querySelector: string): HTMLElement {
        const root: HTMLElement = document.querySelector(querySelector);
        root.innerHTML = this.parseDocument(string, variables);
        return <HTMLElement>root.firstElementChild;
    }

    /**
     * Take a string and parse is with the variables
     * @param string The input string
     * @param variables The variables in the json which can be parsed
     * @return The parsed string
     */
    public parseDocument(string: string, variables): string {
        string = Parser.replaceForLoop(string, variables);
        return Parser.replaceVariables(string, variables);
    }

    /**
     * Replaces for loops
     * @param string The input string
     * @param variables The variables in the json which can be parsed
     */
    private static replaceForLoop(string: string, variables: object): string {

        // Declare the for loop start and end regex
        const start = new RegExp('{% +for [a-zA-Z_]+ +in +[a-zA-Z._]+ +%}');
        const end = new RegExp('{% +endfor +%}');

        let startIndex, endIndex;
        while (1) {
            startIndex = start.exec(string);
            endIndex = end.exec(string);

            // Stop looking for for loops if there are no for loops
            if (!startIndex || !endIndex) {
                break;
            }

            // Get only the relevant loop string
            let loopString = string.substring(startIndex.index, endIndex.index);

            // Extract the variables from the for loop
            const [loopName, variable, relevantString] = Parser.extractVariables(loopString);

            // Get the value of the variable out of the for loop
            const variableValue = Parser.getVariableValue(variable, variables) as any;

            // Construct the updated variables json
            const vJSON = {...variables,};

            let updatedLoopString = '';
            for (let v of variableValue) {
                // Update the for loop variable in the json
                vJSON['' + loopName] = v;
                updatedLoopString += Parser.replaceVariables(relevantString, vJSON);
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
    private static extractVariables(string: string): any[] {
        const startIndex = /{%/.exec(string).index + 2;
        const endIndex = /%}/.exec(string).index;

        let mutatedString = string.substring(startIndex, endIndex);
        mutatedString = mutatedString.replace('for', '').replace('in', '');
        mutatedString = mutatedString.replace(/ +/g, ' ').trim();

        let [loopName, variableName] = mutatedString.split(' ');
        const variableNameList: string[] = variableName.split('.');

        return [loopName, variableNameList, string.slice(endIndex + 2)];

    }

    /**
     * Replace the variables in the template string
     * @param string The template string
     * @param variables A json with the variable name as key of the json
     * @returns The parsed string
     */
    private static replaceVariables(string: string, variables: object): string {

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

            string = Parser.replace(replaceJSON, variables, string);
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
    private static replace(replaceJSON: { string: string[], start: number, end: number }, variables: object, string: string): string {
        const value = Parser.getVariableValue(replaceJSON.string, variables);

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
    private static getVariableValue(stringList: string[], variables: object): object {
        let returnValue = variables;
        for (let stringIndex of stringList) {
            try {
                returnValue = returnValue[stringIndex];
            } catch (e) {
                throw new Error(`Your template is trying to access variables which do not exist\nVariable name: ${stringIndex}`);
            }
        }

        return returnValue;
    }
}