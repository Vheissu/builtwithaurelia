export class PrettifyValueConverter {
    toView(obj) {
        console.log(obj);
        var response = obj;

        try {
            response = JSON.stringify(obj);
        } catch(e) {
            response = obj;
        }

        return response;
    }
}
