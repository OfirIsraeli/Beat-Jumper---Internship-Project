module.exports = {
  millimeters: 7,
  tenthToMm: 0.1807975,
  divisions: 4,
  pageLayout: {
    pageHeight: 1545,
    pageWidth: 1194,
    leftMargin: 70,
    rightMargin: 70,
    topMargin: 88,
    bottomMargin: 88
  },
  parts: {},
  partElements: [
    {
      name: "part",
      attrs: {
        id: "P1"
      },
      children: [
        {
          name: "measure",
          attrs: {
            number: "1",
            width: "404"
          },
          children: [
            {
              name: "print",
              children: [
                {
                  name: "system-layout",
                  children: [
                    {
                      name: "system-margins",
                      children: [
                        {
                          name: "left-margin",
                          text: "0"
                        },
                        {
                          name: "right-margin",
                          text: "214"
                        }
                      ]
                    },
                    {
                      name: "top-system-distance",
                      text: "211"
                    }
                  ]
                },
                {
                  name: "measure-numbering",
                  text: "system"
                }
              ]
            },
            {
              name: "attributes",
              children: [
                {
                  name: "divisions",
                  text: "4"
                },
                {
                  name: "key",
                  children: [
                    {
                      name: "fifths",
                      text: "0"
                    },
                    {
                      name: "mode",
                      text: "major"
                    }
                  ]
                },
                {
                  name: "time",
                  children: [
                    {
                      name: "beats",
                      text: "4"
                    },
                    {
                      name: "beat-type",
                      text: "4"
                    }
                  ]
                },
                {
                  name: "clef",
                  children: [
                    {
                      name: "sign",
                      text: "G"
                    },
                    {
                      name: "line",
                      text: "2"
                    }
                  ]
                },
                {
                  name: "transpose",
                  children: [
                    {
                      name: "diatonic",
                      text: "0"
                    },
                    {
                      name: "chromatic",
                      text: "0"
                    },
                    {
                      name: "octave-change",
                      text: "1"
                    }
                  ]
                },
                {
                  name: "measure-style",
                  children: [
                    {
                      name: "slash",
                      attrs: {
                        type: "start",
                        "use-stems": "yes"
                      }
                    }
                  ]
                }
              ]
            },
            {
              name: "sound",
              attrs: {
                tempo: "120"
              }
            },
            {
              name: "note",
              voice: 1,
              type: "quarter",
              stem: -1,
              xmlDuration: "4",
              pitch: {
                key: "C",
                octave: "4"
              },
              pitchKey: "C4",
              duration: "4",
              divisions: 4
            },
            {
              name: "note",
              voice: 1,
              type: "quarter",
              stem: -1,
              xmlDuration: "4",
              pitch: {
                key: "C",
                octave: "4"
              },
              pitchKey: "C4",
              duration: "4",
              divisions: 4
            },
            {
              name: "note",
              voice: 1,
              type: "eighth",
              rest: "noPlace",
              xmlDuration: "2",
              duration: "8",
              divisions: 2
            },
            {
              name: "note",
              voice: 1,
              type: "eighth",
              stem: -1,
              xmlDuration: "2",
              pitch: {
                key: "C",
                octave: "4"
              },
              pitchKey: "C4",
              duration: "8",
              divisions: 2
            },
            {
              name: "note",
              voice: 1,
              type: "eighth",
              stem: -1,
              beam: {
                name: "beam",
                attrs: {
                  number: "1"
                },
                text: "begin"
              },
              xmlDuration: "2",
              pitch: {
                key: "C",
                octave: "4"
              },
              pitchKey: "C4",
              duration: "8",
              divisions: 2
            },
            {
              name: "note",
              voice: 1,
              type: "eighth",
              stem: -1,
              beam: {
                name: "beam",
                attrs: {
                  number: "1"
                },
                text: "end"
              },
              xmlDuration: "2",
              pitch: {
                key: "C",
                octave: "4"
              },
              pitchKey: "C4",
              duration: "8",
              divisions: 2
            }
          ],
          leftMargin: 0,
          measureFirstInLine: true,
          measureNumber: 1,
          measureLine: 0,
          timeSignature: {
            beats: 4,
            beatType: 4
          },
          tempo: [],
          linesInStaff: 5,
          keySign: "C",
          xmlWidth: 404
        },
        {
          name: "measure",
          attrs: {
            number: "2",
            width: "436"
          },
          children: [
            {
              name: "note",
              voice: 1,
              type: "16th",
              stem: -1,
              beam: {
                name: "beam",
                attrs: {
                  number: "1"
                },
                text: "begin"
              },
              xmlDuration: "1",
              pitch: {
                key: "C",
                octave: "4"
              },
              pitchKey: "C4",
              duration: "16",
              divisions: 1
            },
            {
              name: "note",
              voice: 1,
              type: "16th",
              stem: -1,
              beam: {
                name: "beam",
                attrs: {
                  number: "1"
                },
                text: "continue"
              },
              xmlDuration: "1",
              pitch: {
                key: "C",
                octave: "4"
              },
              pitchKey: "C4",
              duration: "16",
              divisions: 1
            },
            {
              name: "note",
              voice: 1,
              type: "eighth",
              stem: -1,
              beam: {
                name: "beam",
                attrs: {
                  number: "1"
                },
                text: "end"
              },
              xmlDuration: "2",
              pitch: {
                key: "C",
                octave: "4"
              },
              pitchKey: "C4",
              duration: "8",
              divisions: 2
            },
            {
              name: "note",
              voice: 1,
              type: "eighth",
              stem: -1,
              beam: {
                name: "beam",
                attrs: {
                  number: "1"
                },
                text: "begin"
              },
              xmlDuration: "2",
              pitch: {
                key: "C",
                octave: "4"
              },
              pitchKey: "C4",
              duration: "8",
              divisions: 2
            },
            {
              name: "note",
              voice: 1,
              type: "16th",
              stem: -1,
              beam: {
                name: "beam",
                attrs: {
                  number: "1"
                },
                text: "continue"
              },
              xmlDuration: "1",
              pitch: {
                key: "C",
                octave: "4"
              },
              pitchKey: "C4",
              duration: "16",
              divisions: 1
            },
            {
              name: "note",
              voice: 1,
              type: "16th",
              stem: -1,
              beam: {
                name: "beam",
                attrs: {
                  number: "1"
                },
                text: "end"
              },
              xmlDuration: "1",
              pitch: {
                key: "C",
                octave: "4"
              },
              pitchKey: "C4",
              duration: "16",
              divisions: 1
            },
            {
              name: "note",
              voice: 1,
              type: "16th",
              rest: "noPlace",
              xmlDuration: "1",
              duration: "16",
              divisions: 1
            },
            {
              name: "note",
              voice: 1,
              type: "eighth",
              stem: -1,
              beam: {
                name: "beam",
                attrs: {
                  number: "1"
                },
                text: "begin"
              },
              xmlDuration: "2",
              pitch: {
                key: "C",
                octave: "4"
              },
              pitchKey: "C4",
              duration: "8",
              divisions: 2
            },
            {
              name: "note",
              voice: 1,
              type: "16th",
              stem: -1,
              beam: {
                name: "beam",
                attrs: {
                  number: "1"
                },
                text: "end"
              },
              xmlDuration: "1",
              pitch: {
                key: "C",
                octave: "4"
              },
              pitchKey: "C4",
              duration: "16",
              divisions: 1
            },
            {
              name: "note",
              voice: 1,
              type: "quarter",
              stem: -1,
              xmlDuration: "4",
              pitch: {
                key: "C",
                octave: "4"
              },
              pitchKey: "C4",
              duration: "4",
              divisions: 4
            },
            {
              name: "barline",
              attrs: {
                location: "right"
              },
              children: [
                {
                  name: "bar-style",
                  text: "light-heavy"
                }
              ]
            }
          ],
          measureNumber: 2,
          measureLine: 0,
          measureLastInLine: true,
          timeSignature: {
            beats: 4,
            beatType: 4
          },
          tempo: [],
          linesInStaff: 5,
          keySign: "C",
          xmlWidth: 436
        }
      ],
      instrument: {
        scorePart: "P1",
        partName: "Xylophone",
        instrumentSound: "notRecognized"
      },
      instrumentTranspose: "P1",
      multiVoicePart: false
    }
  ],
  measureInLine: [2],
  lastMeasureNumber: 2,
  hasPickup: false,
  firstMeasureNumber: 1,
  allInstruments: [],
  allInstrumentsBanks: [],
  instruments: {
    "P1-I1": {
      scorePart: "P1",
      partName: "Xylophone",
      instrumentSound: "notRecognized"
    }
  },
  multiStaffScore: false,
  multiVoices: false,
  systemLeftMargins: 0,
  barLines: [
    {
      barType: 3,
      barLocation: "right",
      noteIndex: 10,
      measureNumber: 2,
      partIndex: 0
    }
  ],
  voltas: [],
  voltaJumps: {},
  timeChange: {
    "1": {
      beats: 4,
      beatType: 4
    }
  },
  tempoChange: {},
  hasTempoChange: false,
  clefChange: {
    "0": {
      "1": "treble"
    }
  },
  keySignChange: {
    "1": "C"
  },
  measureStyle: {
    "0": {
      "1": {
        type: "start",
        useStems: "yes"
      }
    }
  },
  pickupDivisions: 0,
  filename: "beats1.xml"
};
