<<<<<<< HEAD
const test = {
=======
module.exports = {
  audioTracks: [
    {
      url: "/assets/sounds/background.mp3",
      tempo: 90,
      name: "background",
    },
  ],
>>>>>>> f0b482dfc9e64bb921479239db7e6f97dd33a482
  millimeters: 7,
  tenthToMm: 0.1807975,
  divisions: 2,
  pageLayout: {
    pageHeight: 1545,
    pageWidth: 1194,
    leftMargin: 70,
    rightMargin: 70,
    topMargin: 88,
    bottomMargin: 88,
  },
  parts: {},
  partElements: [
    {
      name: "part",
      attrs: {
        id: "P1",
      },
      children: [
        {
          name: "measure",
          attrs: {
            number: "1",
<<<<<<< HEAD
            width: "349",
=======
            width: "389",
>>>>>>> f0b482dfc9e64bb921479239db7e6f97dd33a482
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
<<<<<<< HEAD
                          text: "0",
                        },
                        {
                          name: "right-margin",
                          text: "413",
=======
                          text: "158",
                        },
                        {
                          name: "right-margin",
                          text: "173",
>>>>>>> f0b482dfc9e64bb921479239db7e6f97dd33a482
                        },
                      ],
                    },
                    {
                      name: "top-system-distance",
                      text: "211",
                    },
                  ],
                },
                {
                  name: "measure-numbering",
                  text: "system",
                },
              ],
            },
            {
              name: "attributes",
              children: [
                {
                  name: "divisions",
                  text: "2",
                },
                {
                  name: "key",
                  children: [
                    {
                      name: "fifths",
                      text: "0",
                    },
                    {
                      name: "mode",
                      text: "major",
                    },
                  ],
                },
                {
                  name: "time",
                  children: [
                    {
                      name: "beats",
                      text: "4",
                    },
                    {
                      name: "beat-type",
                      text: "4",
                    },
                  ],
                },
                {
                  name: "clef",
                  children: [
                    {
                      name: "sign",
                      text: "G",
                    },
                    {
                      name: "line",
                      text: "2",
                    },
                  ],
                },
              ],
            },
            {
              name: "sound",
              attrs: {
                tempo: "120",
              },
            },
            {
              name: "note",
              voice: 1,
              type: "quarter",
              stem: -1,
              xmlDuration: "2",
              pitch: {
                key: "C",
                octave: "5",
              },
              pitchKey: "C5",
              duration: "4",
              divisions: 2,
            },
            {
              name: "note",
              voice: 1,
              type: "quarter",
              stem: -1,
              xmlDuration: "2",
              pitch: {
                key: "C",
                octave: "5",
              },
              pitchKey: "C5",
              duration: "4",
              divisions: 2,
            },
            {
              name: "note",
              voice: 1,
              type: "quarter",
              stem: -1,
              xmlDuration: "2",
              pitch: {
                key: "C",
                octave: "5",
              },
              pitchKey: "C5",
              duration: "4",
              divisions: 2,
            },
            {
              name: "note",
              voice: 1,
              type: "eighth",
              stem: -1,
              beam: {
                name: "beam",
                attrs: {
                  number: "1",
                },
                text: "begin",
              },
              xmlDuration: "1",
              pitch: {
                key: "C",
                octave: "5",
              },
              pitchKey: "C5",
              duration: "8",
              divisions: 1,
            },
            {
              name: "note",
              voice: 1,
              type: "eighth",
              stem: -1,
              beam: {
                name: "beam",
                attrs: {
                  number: "1",
                },
                text: "end",
              },
              xmlDuration: "1",
              pitch: {
                key: "C",
                octave: "5",
              },
              pitchKey: "C5",
              duration: "8",
              divisions: 1,
            },
          ],
          leftMargin: 158,
          measureFirstInLine: true,
          measureNumber: 1,
          measureLine: 0,
          timeSignature: {
            beats: 4,
            beatType: 4,
          },
          tempo: [],
          linesInStaff: 5,
          keySign: "C",
<<<<<<< HEAD
          xmlWidth: 349,
=======
          xmlWidth: 389,
>>>>>>> f0b482dfc9e64bb921479239db7e6f97dd33a482
        },
        {
          name: "measure",
          attrs: {
            number: "2",
<<<<<<< HEAD
            width: "292",
=======
            width: "334",
>>>>>>> f0b482dfc9e64bb921479239db7e6f97dd33a482
          },
          children: [
            {
              name: "note",
              voice: 1,
              type: "eighth",
              stem: -1,
              beam: {
                name: "beam",
                attrs: {
                  number: "1",
                },
                text: "begin",
              },
              xmlDuration: "1",
              pitch: {
                key: "C",
                octave: "5",
              },
              pitchKey: "C5",
              duration: "8",
              divisions: 1,
            },
            {
              name: "note",
              voice: 1,
              type: "eighth",
              stem: -1,
              beam: {
                name: "beam",
                attrs: {
                  number: "1",
                },
                text: "end",
              },
              xmlDuration: "1",
              pitch: {
                key: "C",
                octave: "5",
              },
              pitchKey: "C5",
              duration: "8",
              divisions: 1,
            },
            {
              name: "note",
              voice: 1,
              type: "eighth",
              stem: -1,
              beam: {
                name: "beam",
                attrs: {
                  number: "1",
                },
                text: "begin",
              },
              xmlDuration: "1",
              pitch: {
                key: "C",
                octave: "5",
              },
              pitchKey: "C5",
              duration: "8",
              divisions: 1,
            },
            {
              name: "note",
              voice: 1,
              type: "eighth",
              stem: -1,
              beam: {
                name: "beam",
                attrs: {
                  number: "1",
                },
                text: "end",
              },
              xmlDuration: "1",
              pitch: {
                key: "C",
                octave: "5",
              },
              pitchKey: "C5",
              duration: "8",
              divisions: 1,
            },
            {
              name: "note",
              voice: 1,
              type: "quarter",
              stem: -1,
              xmlDuration: "2",
              pitch: {
                key: "C",
                octave: "5",
              },
              pitchKey: "C5",
              duration: "4",
              divisions: 2,
            },
            {
              name: "note",
              voice: 1,
              type: "quarter",
              stem: -1,
              xmlDuration: "2",
              pitch: {
                key: "C",
                octave: "5",
              },
              pitchKey: "C5",
              duration: "4",
              divisions: 2,
            },
            {
              name: "barline",
              attrs: {
                location: "right",
              },
              children: [
                {
                  name: "bar-style",
                  text: "light-heavy",
                },
              ],
            },
          ],
          measureNumber: 2,
          measureLine: 0,
          measureLastInLine: true,
          timeSignature: {
            beats: 4,
            beatType: 4,
          },
          tempo: [],
          linesInStaff: 5,
          keySign: "C",
<<<<<<< HEAD
          xmlWidth: 292,
=======
          xmlWidth: 334,
>>>>>>> f0b482dfc9e64bb921479239db7e6f97dd33a482
        },
      ],
      instrument: {
        scorePart: "P1",
        partName: "MusicXML Part",
        instrumentSound: "notRecognized",
      },
      instrumentTranspose: "P1",
      multiVoicePart: false,
    },
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
      partName: "MusicXML Part",
      instrumentSound: "notRecognized",
    },
  },
  multiStaffScore: false,
  multiVoices: false,
  systemLeftMargins: 158,
  barLines: [
    {
      barType: 3,
      barLocation: "right",
      noteIndex: 6,
      measureNumber: 2,
      partIndex: 0,
    },
  ],
  voltas: [],
  voltaJumps: {},
  timeChange: {
    1: {
      beats: 4,
      beatType: 4,
    },
  },
  tempoChange: {},
  hasTempoChange: false,
  clefChange: {
    0: {
      1: "treble",
    },
  },
  keySignChange: {
    1: "C",
  },
  measureStyle: {},
  pickupDivisions: 0,
  filename: "beat.xml",
};
export default test;
