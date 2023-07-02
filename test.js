const array = [
    '180.00', '180.00', '180.00',
    '180.00', '183.86', '185.00',
    '185.00', '188.00', '190.00',
    '190.00', '190.00', '195.00',
    '198.00', '200.00', '200.00',
    '210.00', '210.00', '210.00',
    '225.00', '240.00'
  ]

function median(arr){
    arr.sort((a, b) => { return a - b; });
    var i = arr.length / 2;
    return i % 1 == 0 ? (Number(arr[i - 1]) + Number(arr[i])) / 2 : arr[Math.floor(i)];
}

console.log(median(array))