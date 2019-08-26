var testLayout = [
    { "x": 0, "y": 0, "w": 1, "h": 1, "i": "0", selected: false },
    { "x": 5, "y": 5, "w": 1, "h": 1, "i": "1", selected: false },
    { "x": 2, "y": 12, "w": 1, "h": 1, "i": "2", selected: false },
    { "x": 7, "y": 6, "w": 1, "h": 1, "i": "3", selected: false },
    { "x": 10, "y": 8, "w": 1, "h": 1, "i": "4", selected: false },
    { "x": 5, "y": 0, "w": 1, "h": 1, "i": "5", selected: false }
];
var app = new Vue({
    el: '#app',
    data: {
        currentTab: 'fixtures',
        fixturesDisplay: 'fixtures',
        fixtures: testLayout,
        layoutMode: false
    },
    methods: {
        selectItem: function (item) {
            if (app.layoutMode == false) {
                item.selected = !item.selected;
            }
        }
    }
});
