module.exports.questions = [
    "Do you like hot spring?",
    "Do you like museum?",
    "Is air quality important to you?",
    "Do you want to have street food?",
    "Do you want to go to America?",
    "Do you want to have Asian food?",
    "Do you want to visit top university?",
    "Do you wish to encounter movie stars?",
    "Do you want to explore languages other than Chinese and English?"
];

module.exports.destinations = [
    "Budapest",
    "Mexico City",
    "Hokkaido",
    "Taipei",
    "Heidelberg",
    "Los Angeles"
]

module.exports.questionDestinationMatch = [
    ["Budapest", "Hokkaido", "Taipei"],
    ["Mexico City", "Los Angeles"],
    ["Budapest", "Hokkaido", "Heidelberg"],
    ["Mexico City", "Taipei"],
    ["Mexico City", "Los Angeles"],
    ["Mexico City", "Taipei", "Los Angeles"],
    ["Taipei", "Heidelberg", "Los Angeles"],
    ["Taipei", "Los Angeles"],
    ["Heidelberg", "Hokkaido"]
];
