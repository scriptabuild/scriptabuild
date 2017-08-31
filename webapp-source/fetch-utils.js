
export let throwHttpError = (response) => {
    throw new Error(`Fetch(...) returned an error: ${response.status} ${response.statusText}`);
};

export let getJsonOrFailOnHttpError = (response) => response.ok ? response.json() : throwHttpError(response);

export let getEmptyOrFailOnHttpError = (response) => response.ok ? undefined : throwHttpError(response);

