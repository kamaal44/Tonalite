var socket = io('http://' + document.domain + ':' + location.port);
var app = new Vue({
    el: '#app',
    data: {
        currentTab: 'fixtures',
        fixturesDisplay: 'fixtures',
        layoutMode: false,
        fixtures: [],
        groups: [],
        cues: [],
        presets: [],
        selectedFixtures: [],
        selectedPatchedFixtures: [],
        selectedGroups: [],
        selectedCues: [],
        selectedPresets: [],
        selectedProfile: '',
        selectedProfileManufacturer: '',
        selectedProfileMode: '',
        selectedProfileFile: '',
        fixtureProfileManufacturers: [],
        fixtureProfileModes: [],
        fixtureProfiles: [],
        fixtureProfileCreationCount: 1,
        fixtureProfileCreationUniverse: 1,
        fixtureProfileCreationAddress: 1,
        fixtureProfileCreationAddressOffset: 0,
        selectedFixturesParameters: []
    },
    methods: {
        setLayoutMode: function (value) {
            app.layoutMode = value;
            app.deselectAllFixtures();
        },
        launchFullScreen: function () {
            var element = document.documentElement;
            if (element.requestFullScreen) {
                element.requestFullScreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            } else if (element.msRequestFullScreen) {
                element.msRequestFullScreen();
            } else {
                element.webkitEnterFullScreen();
            }
        },
        selectFixture: function (fixtureID) {
            if (app.layoutMode == false) {
                if (app.selectedFixtures.indexOf(fixtureID) >= 0) {
                    app.selectedFixtures.splice(app.selectedFixtures.indexOf(fixtureID), 1);
                } else {
                    app.selectedFixtures.push(fixtureID);
                }
            }
        },
        selectPatchedFixture: function (fixtureID) {
            if (app.selectedPatchedFixtures.indexOf(fixtureID) >= 0) {
                app.selectedPatchedFixtures.splice(app.selectedPatchedFixtures.indexOf(fixtureID), 1);
            } else {
                app.selectedPatchedFixtures.push(fixtureID);
            }
        },
        selectGroup: function (groupID) {
            if (app.selectedGroups.indexOf(groupID) >= 0) {
                app.selectedGroups.splice(app.selectedGroups.indexOf(groupID), 1);
            } else {
                app.selectedGroups.push(groupID);
            }
        },
        selectCue: function (cueID) {
            if (app.selectedCues.indexOf(cueID) >= 0) {
                app.selectedCues.splice(app.selectedCues.indexOf(cueID), 1);
            } else {
                app.selectedCues.push(cueID);
            }
        },
        selectPreset: function (presetID) {
            if (app.selectedPresets.indexOf(presetID) >= 0) {
                app.selectedPresets.splice(app.selectedPresets.indexOf(presetID), 1);
            } else {
                app.selectedPresets.push(presetID);
            }
        },
        deselectAllFixtures: function () {
            app.selectedFixtures = [];
        },
        selectAllFixtures: function () {
            let f = 0; const fMax = app.fixtures.length; for (; f < fMax; f++) {
                if (app.selectedFixtures.includes(app.fixtures[f].i) == false) {
                    app.selectedFixtures.push(app.fixtures[f].i);
                }
            }
        },
        deselectAllPatchedFixtures: function () {
            app.selectedPatchedFixtures = [];
        },
        selectAllPatchedFixtures: function () {
            let f = 0; const fMax = app.fixtures.length; for (; f < fMax; f++) {
                if (app.selectedPatchedFixtures.includes(app.fixtures[f].i) == false) {
                    app.selectedPatchedFixtures.push(app.fixtures[f].i);
                }
            }
        },
        deselectAllGroups: function () {
            app.selectedGroups = [];
        },
        selectAllGroups: function () {
            let g = 0; const gMax = app.groups.length; for (; g < gMax; g++) {
                if (app.selectedGroups.includes(app.groups[g].i) == false) {
                    app.selectedGroups.push(app.groups[g].i);
                }
            }
        },
        deselectAllCues: function () {
            app.selectedCues = [];
        },
        deselectAllPresets: function () {
            app.selectedPresets = [];
        },
        closeAddFixtureModal: function () {
            $("#addFixtureModal").modal('hide');
            app.selectedProfile = '';
            app.selectedProfileManufacturer = '';
            app.selectedProfileMode = '';
            app.fixtureProfileManufacturers = [];
            app.fixtureProfileModes = [];
            app.fixtureProfiles = [];
            app.fixtureProfileCreationAddress = 1;
            app.fixtureProfileCreationCount = 1;
            app.fixtureProfileCreationUniverse = 1;
            app.fixtureProfileCreationAddressOffset = 0;
            app.selectedProfileFile = '';
        },
        selectFixtureProfileManufacturer: function (manufacturer) {
            app.fixtureProfileModes = [];
            app.selectedProfileManufacturer = manufacturer;
            app.selectedProfile = '';
            app.selectedProfileMode = '';
            app.selectedProfileFile = '';
            socket.emit('getFixtureProfiles', app.selectedProfileManufacturer);
        },
        selectFixtureProfile: function (profile) {
            app.fixtureProfileModes = [];
            app.selectedProfile = profile;
            app.selectedProfileMode = '';
            app.selectedProfileFile = '';
            socket.emit('getFixtureProfileModes', { "manufacturer": app.selectedProfileManufacturer, "profile": app.selectedProfile });
        },
        selectFixtureProfileMode: function (mode) {
            app.selectedProfileMode = mode.mode;
            app.selectedProfileFile = mode.file;
        },
        getFixtureProfileManufacturers: function () {
            socket.emit('getFixtureProfileManufacturers');
        },
        addFixture: function () {
            socket.emit('addFixture', { "manufacturer": app.selectedProfileManufacturer, "profile": app.selectedProfile, "mode": app.selectedProfileMode, "file": app.selectedProfileFile, "count": app.fixtureProfileCreationCount, "universe": app.fixtureProfileCreationUniverse, "address": app.fixtureProfileCreationAddress, "offset": app.fixtureProfileCreationAddressOffset })
            app.closeAddFixtureModal();
        },
        fixtureItemMoved: function (fixture) {
            socket.emit('fixtureItemMoved', { "id": fixture.i, "x": fixture.x, "y": fixture.y });
        },
        duplicateSelectedPatchedFixtures: function () {
            if (app.selectedPatchedFixtures.length > 0) {
                socket.emit('duplicateFixtures', app.selectedPatchedFixtures);
            }
        },
        deleteSelectedPatchedFixtures: function () {
            if (app.selectedPatchedFixtures.length > 0) {
                socket.emit('deleteFixtures', app.selectedPatchedFixtures);
            }
        },
        groupSelectedFixtures: function () {
            if (app.selectedFixtures.length > 0) {
                socket.emit('groupFixtures', app.selectedFixtures);
            }
        },
        groupSelectedGroups: function () {
            if (app.selectedGroups.length > 0) {
                socket.emit('groupGroups', app.selectedGroups);
            }
        },
        deleteSelectedGroups: function () {
            if (app.selectedGroups.length > 0) {
                socket.emit('deleteGroups', app.selectedGroups);
            }
        },
        updateSelectedFixturesParameters: function () {
            if (app.selectedFixtures.length > 0) {
                var parameterCats = [];
                app.selectedFixturesParameters = [];
                var fixture = {};
                var newParameter = {};
                let i = 0; const iMax = app.selectedFixtures.length; for (; i < iMax; i++) {
                    if (app.fixtures.some(e => e.i === app.selectedFixtures[i])) {
                        fixture = app.fixtures[app.fixtures.map(el => el.i).indexOf(app.selectedFixtures[i])];
                        let p = 0; const pMax = fixture.parameters.length; for (; p < pMax; p++) {
                            newParameter = JSON.parse(JSON.stringify(fixture.parameters[p]));
                            if (!parameterCats.includes(newParameter.name + ":" + newParameter.type)) {
                                app.selectedFixturesParameters.push(newParameter);
                                parameterCats.push(newParameter.name + ":" + newParameter.type);
                            }
                        }
                    }
                }
            }
        },
        openFixtureParameters: function () {
            if (app.selectedFixtures.length > 0) {
                app.updateSelectedFixturesParameters();
                app.fixturesDisplay = 'parameters';
            }
        },
        openGroupParameters: function () {
            if (app.selectedGroups.length > 0) {
                app.selectedFixtures = [];
                var group = {};
                let g = 0; const gMax = app.selectedGroups.length; for (; g < gMax; g++) {
                    group = app.groups[app.groups.map(el => el.i).indexOf(app.selectedGroups[g])];
                    let f = 0; const fMax = group.fixtures.length; for (; f < fMax; f++) {
                        if (!app.selectedFixtures.includes(group.fixtures[f])) {
                            app.selectedFixtures.push(group.fixtures[f]);
                        }
                    }
                }
                if (app.selectedFixtures.length > 0) {
                    app.updateSelectedFixturesParameters();
                    app.fixturesDisplay = 'parameters';
                }
            }
        },
        updateFixtureParameterValue: function (param) {
            param.value = param.displayValue;
            socket.emit('updateFixtureParameterValue', { "fixtures": app.selectedFixtures, "paramName": param.name, "paramType": param.type, "paramValue": param.value });
        },
        resetFixtures: function () {
            socket.emit('resetFixtures');
        },
        resetSelectedFixtures: function () {
            socket.emit('resetSelectedFixtures', app.selectedFixtures);
        },
        mapRange: function (num, inMin, inMax, outMin, outMax) {
            return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
        },
        useParameterRange: function (param, range) {
            param.value = app.mapRange(range.default, 0, 255, 0, 65535);
            param.displayValue = param.value;
            socket.emit('updateFixtureParameterValue', { "fixtures": app.selectedFixtures, "paramName": param.name, "paramType": param.type, "paramValue": param.value });
        },
        openTab: function (tab) {
            app.fixturesDisplay = 'fixtures';
            app.currentTab = tab;
        },
        getEditFixtureName: function () {
            if (app.selectedPatchedFixtures.length > 0) {
                return app.fixtures[app.fixtures.map(el => el.i).indexOf(app.selectedPatchedFixtures[0])].name;
            }
        },
        getEditFixtureUniverse: function () {
            if (app.selectedPatchedFixtures.length > 0) {
                return app.fixtures[app.fixtures.map(el => el.i).indexOf(app.selectedPatchedFixtures[0])].universe;
            }
        },
        getEditFixtureAddress: function () {
            if (app.selectedPatchedFixtures.length > 0) {
                return app.fixtures[app.fixtures.map(el => el.i).indexOf(app.selectedPatchedFixtures[0])].address;
            }
        },
        getEditGroupName: function () {
            if (app.selectedGroups.length > 0) {
                return app.groups[app.groups.map(el => el.i).indexOf(app.selectedGroups[0])].name;
            }
        },
        editFixtureName: function (value) {
            if (app.selectedPatchedFixtures.length > 0) {
                socket.emit('editFixtureName', { fixtures: app.selectedPatchedFixtures, value: value });
            }
        },
        editFixtureUniverse: function (value) {
            if (app.selectedPatchedFixtures.length == 1) {
                socket.emit('editFixtureUniverse', { fixtures: app.selectedPatchedFixtures, value: value });
            }
        },
        editFixtureAddress: function (value) {
            if (app.selectedPatchedFixtures.length == 1) {
                socket.emit('editFixtureAddress', { fixtures: app.selectedPatchedFixtures, value: value });
            }
        },
        editGroupName: function (value) {
            if (app.selectedGroups.length > 0) {
                socket.emit('editGroupName', { groups: app.selectedGroups, value: value });
            }
        }
    }
});

socket.on('connect', function () {
    app.currentTab = 'fixtures';
    app.fixturesDisplay = 'fixtures';
    app.layoutMode = false;
    app.fixtures = [];
    app.groups = [];
    app.cues = [];
    app.presets = [];
    app.selectedFixtures = [];
    app.selectedPatchedFixtures = [];
    app.selectedGroups = [];
    app.selectedCues = [];
    app.selectedPresets = [];
    app.selectedProfile = '';
    app.selectedProfileManufacturer = '';
    app.selectedProfileMode = '';
    app.selectedProfileFile = '';
    app.fixtureProfileManufacturers = [];
    app.fixtureProfileModes = [];
    app.fixtureProfiles = [];
    app.fixtureProfileCreationCount = 1;
    app.fixtureProfileCreationUniverse = 1;
    app.fixtureProfileCreationAddress = 1;
    app.fixtureProfileCreationAddressOffset = 0;
    app.selectedFixturesParameters = [];
});

socket.on('fixtures', function (msg) {
    app.fixtures = msg;
    if (app.fixturesDisplay == 'parameters') {
        app.updateSelectedFixturesParameters();
    }
});

socket.on('groups', function (msg) {
    app.groups = msg;
});

socket.on('fixtureProfilesManufacturers', function (msg) {
    app.fixtureProfileManufacturers = msg;
});

socket.on('fixtureProfiles', function (msg) {
    app.fixtureProfiles = msg;
});

socket.on('fixtureProfileModes', function (msg) {
    app.fixtureProfileModes = msg;
});
