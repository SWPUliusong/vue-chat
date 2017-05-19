const prefix = '/img/paopao/'

let arr = [], temp

for (let i = 1; i < 23; i++) {
    temp = i
    if (i < 10) {
        temp = '0' + temp
    }

    temp = `${prefix}${temp}.png`

    arr.push(temp)
}

export default arr