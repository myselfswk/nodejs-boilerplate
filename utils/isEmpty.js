let allCheck;

export const isEmpty = (body) => {
    for (var i = 0; i < Object.values(body).length; i++) {
        if (Object.values(body)[i].length === 0) {
            allCheck = false;
            return;
        } else {
            allCheck = true;
        }
    }

    return allCheck;
}