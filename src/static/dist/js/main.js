"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Create all the components and initialize them
const homeComponent = new Home();
const oneBlackboardComponent = new OneBlackboard();
const notFoundComponent = new NotFound();
// Create a new search
new Search();
/**
 * Remove all current components (gets called after every url change)
 */
function removeAll() {
    homeComponent.remove();
    oneBlackboardComponent.remove();
    notFoundComponent.remove();
}
/**
 * Format the api response so it can be displayed properly
 * @param apiResponse The api response
 * @return The modified api object
 */
function formatApiData(apiResponse) {
    // Show the placeholder if no blackboard is in the database
    if (apiResponse.blackboard_list.length === 0) {
        apiResponse.placeholder_list = [1];
    }
    else {
        apiResponse.placeholder_list = [];
    }
    apiResponse.blackboard_list.forEach(blackboard => {
        blackboard.editedIcon = blackboard.is_edit ? 'check' : 'close';
        blackboard.emptyIcon = blackboard.is_empty ? 'close' : 'check';
        blackboard.timestamp_create = new Date(blackboard.timestamp_create * 1000).toLocaleString();
        blackboard.timestamp_edit = new Date(blackboard.timestamp_edit * 1000).toLocaleString();
    });
    return apiResponse;
}
/**
 * Main entry point
 */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const routes = [
            { path: '/blackboard/{board_name}', view: oneBlackboard },
            { path: '/', view: home, title: 'Select Blackboard' },
            { path: '**', view: notFound, title: 'Not found' }
        ];
        const app = new WebApp(routes, removeAll);
        yield app.init();
    });
}
// Start the main app
window.onload = main;
//# sourceMappingURL=main.js.map