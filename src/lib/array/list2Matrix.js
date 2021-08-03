export function list2Matrix(arr, width) {
    return arr.reduce(function (rows, key, index) {
        return (index % width == 0 ? rows.push([key])
            : rows[rows.length - 1].push(key)) && rows;
    }, []);
}