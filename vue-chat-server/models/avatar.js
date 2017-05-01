let user = [
    'FrsP_fKd26dFBbbIQTtJ1IpEXbct',
    'FqzW9bqSJLGjx4yCwBdR6YallVis',
    'FqGy-gAxwYr9lKwQxXjB7QFhehgs',
    'FpiKWZxVi2ZvPkg9G1YkBrvyNXUd',
    'FlmQyroSCee5kwHIZ-k7rIC9UYsK',
    'FkqOXqYnO_6ZKGinwcEYK94vSNpP',
    'Fkfc7nDn1I2r1cdBFzvzVTKcOzeC',
    'FhKC2btY7UkL6jXLc5ygiSEqR3Kx',
    'FhAa3WusC6N8zciLg-6zJkgwfirr',
    'FgLNtLQsduVqAxSzNzOkDjnyV0Dz'
]

let group = [
    'Fs78VD3Owcpdp2j0XzaHXHX3Fu_3',
    'FpzhUhaVyhs6nK-VvululSweD1yG',
    'Fom5nX-UEo1VJdSK0aQkMwky2NtJ',
    'FoHvYP7zIUIxtwJiT7fATMst3kv4',
    'FnKKljiSMjzkKARlGnB1tJb8HqTF',
    '26123517m5bg.jpg',
    'FjoRiCS7U1Sc5Rkv5JXWc51XUC4C',
    'FkvzGzqARaO4TMn7FCwsgn8sRvhA',
    'FlPm5nSeDgilXmxOc7lYaPMKAeTt',
    'FlaMfV3woBqzISvdMzt9FIpEj0qY'
]


module.exports = {
    user: _.map(user, item => 'http://ol5140dkq.bkt.clouddn.com/' + item),
    group: _.map(group, item => 'http://ol5140dkq.bkt.clouddn.com/' + item)
}