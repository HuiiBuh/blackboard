var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const apiClient = new APIClient('/api');
/**
 * Render the home view
 */
function home() {
    return __awaiter(this, void 0, void 0, function* () {
        yield homeComponent.show();
    });
}
/**
 * Render the one blackboard view
 */
function oneBlackboard() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `/api/blackboards/${location.pathname.split('/').pop()}`;
        const apiResponse = yield apiClient.executeRequest('GET', url, '').catch((e) => {
            console.error(e);
            // Return the not found page if the server returns a 404
            if (e.status === 404)
                return notFound();
            new Message(e.message.detail, 'error').show();
            return;
        });
        // Replace the 'null' in the api response for a empty string
        if (!apiResponse.content) {
            apiResponse.content = '';
        }
        yield oneBlackboardComponent.show(apiResponse);
    });
}
/**
 * Render the not found view
 */
function notFound() {
    notFoundComponent.show();
}
//# sourceMappingURL=views.js.map