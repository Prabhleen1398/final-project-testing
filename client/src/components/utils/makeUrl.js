function makeUrl(type) {
    let contentUrl = 'http://localhost:8000/api/' + type;
    return contentUrl;
}

function makeUrlId(type, id) {
    let contentUrl = 'http://localhost:8000/api/' + type + `/${id}`;
    return contentUrl;
}

function makeUrlSort(type, sort, questions) {
    let contentUrl = 'http://localhost:8000/api/';
    const params = new URLSearchParams();
    params.append('sort', sort);
    questions.forEach(id => params.append('questions[]', id));
    //  + type + `?sort=${sort}` + '&' + `questions=${questions}`;
    contentUrl += type + `?${params.toString()}`;
    return contentUrl;
}

function makeUrlSearch(type, searchInput) {
    let contentUrl = 'http://localhost:8000/api/' + type + `/?searchInput=${searchInput}`;
    return contentUrl;
}

function makeUrlSession(type, username) {
    let contentUrl = 'http://localhost:8000/api/' + type + `/?username=${username}`;
    return contentUrl;
}

function makeUrlIdAndComment(type, id) {
    let contentUrl = 'http://localhost:8000/api/' + type + `/${id}`;
    return contentUrl;
}

export { makeUrl, makeUrlId, makeUrlSort, makeUrlSearch, makeUrlSession, makeUrlIdAndComment };