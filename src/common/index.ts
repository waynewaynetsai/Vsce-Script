export function extractErrorMessage(e: any) {
    let message: string;
    if (typeof e === 'string') {
        message = e;
        return message;
    } else if (typeof e?.message === 'string') {
        message = e.message;
        return message;
    } else if (typeof e.reason === 'string') {
        message = e.reason;
        return message;
    }
};

export function thenableToPromise(thenable: Thenable<any>) {
    return new Promise((resolve, reject) => {
        try {
            thenable.then(data => resolve(data));
        } catch (error) {
            reject(error);
        }
    });
}