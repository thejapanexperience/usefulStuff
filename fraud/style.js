export default theme => ({
    Wide: {
        background: theme['$panel-border-color'],
        '& .header': {
            fontFamily: theme['$font-heading'],
            color: theme['$text-color'],
            paddingBottom: 20
        },

        '& .incident-item': {
            cursor: 'pointer',
            paddingLeft: 20,
            paddingTop: 8,
            paddingBottom: 8,

            '&:not(.selected)': {
                '& .incident-type': {
                    color: theme['$link-color']
                },

                '&:hover': {
                    backgroundColor: '#f5f5f5' // might be better to "darken(theme['$background-color'], 10%)" somehow???
                }
            },

            '&.selected': {
                backgroundColor: theme['$background-color'],
                position: 'relative',

                '&::after': {
                    content: '\'\u203A\'',
                    position: 'absolute',
                    top: '33%',
                    right: 8,
                    fontSize: 24
                },

                '& .incident-type': {
                    fontWeight: 'bold'
                }
            }
        }
    },
    Context: {
        justifyContent: 'space-between',
        '& .action-title': {
            marginRight: 13,
            paddingTop: 1,
            fontSize: 12,
            marginTop: 0,
            display: 'inline-block',
            verticalAlign: 'middle',
        },
        '& #partner-actions': {
            minWidth: 160,
            height: 32
        }
    },
    FShape: {
        width: '100%'
    },
    Main: {
        display: 'flex',
        flexDirection: 'column',
        height: 'auto',
    },
    Page: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: '100%',

    }
});
