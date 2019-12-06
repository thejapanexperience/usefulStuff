const includeInCoverage = [
    'src/compositions/reporting/fraud/**',
];

const excludeFromCoverage = [ // add ! to exclude
    '!src/**/__integrationTests/*',
    '!src/**/routes.js', // Covered in selenium end-to-end tests
    '!src/**/*.spec.js',
    '!src/**/*.test.js',
];

const ignoredImportExtensions = [
    'css', 'styl', 'less', 'sass', 'scss', 'yml',
    'jpg', 'jpeg', 'png', 'gif', 'ico',
    'eot', 'otf', 'webp', 'svg', 'ttf', 'woff', 'woff2',
    'mp4', 'webm', 'wav', 'mp3', 'm4a', 'aac', 'oga',
];

module.exports = {
    automock: false,
    moduleNameMapper: {
        [ '\\.(' + ignoredImportExtensions.join('|') + ')$' ]: 'identity-obj-proxy',
    },
    testMatch: [
        '<rootDir>/src/**/*/?(*.)+(jest).[jt]s?(x)'
    ],
    transform: {
        '\\.jsx?$': 'babel-jest',
    },
    globals: {
        NODE_ENV: 'test',
    },
    verbose: true,
    collectCoverageFrom: [...includeInCoverage, ...excludeFromCoverage],
    coverageDirectory: 'coverage/jest',
    coverageReporters: ['json', 'lcov', 'text-summary'],
    'coverageThreshold': {
        'global': {
            'branches': 80,
            'functions': 85,
            'lines': 85,
            'statements': 85
        },
    },
};
