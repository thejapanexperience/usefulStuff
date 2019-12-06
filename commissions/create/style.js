export default theme => ({
    '@global' : {
        '#DatePickerOverlay.hasTimePicker':{
            '& #timepicker-DatePickerTimePicker': {
                height: 32,
                lineHeight: '14px',

                '& li': {
                    lineHeight: '16px'
                },
            },

            '& #DatePickerActionsSubmitButton': {
                height: 32,
                paddingTop: 6,
                lineHeight: '14px',
            },
        }
    },

    ZShape: {
        width: '100%',
        maxHeight: 'calc(100vh - 55px)',
        padding: 0,
        color: theme['$text-color'],
    },

    Context: {
        padding: '0 20px',

        '& .indicatorBox': {
            position: 'absolute',
            right: 0,
            width: '100%'
        },

        '& .indicator': {
            width: 500,
            margin: 'auto'
        }
    },

    Main: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',

        '& .title': {
            fontFamily: theme['$font-heading'],
            fontWeight: 700,
            fontSize: 14,
            marginBottom: 35
        },

        '& .verticalSpacer': {
            width: '100%',
            flex: 1,
        },

        '& .bottomButtons': {
            display: 'flex',
            height: '50px',
            marginTop: 20,

            '& .previousStep': {
                margin: 'auto auto auto 0',
                textAlign: 'left',

                '& .previousStepText': {
                    margin: 'auto',
                }
            },

            '& .nextStep': {
                margin: 'auto 0 auto auto',
                display: 'flex',
                textAlign: 'right',

                '& a': {
                    margin: 'auto'
                },

                '& .button': {
                    marginLeft: 10,
                    height: 32,
                    lineHeight: '12px'
                }
            },
        }
    },

    DialoguePages: {
        flex: 1,
        overflowY: 'auto',

        '& Label': {
            padding: '9px 0',
        },

        '& .multipleInputs': {
            display: 'flex',
            flexDirection: 'horizontal'
        },

        '& .wrappedInput': {
            marginBottom: 10,

            '& Input': {
                minWidth: 160,
                width: 160,
                height: 32,
            },

            '& Button': {
                minWidth: 160,
                height: 32,

                '& li.input': {
                    lineHeight: '16px',
                    backgroundColor: 'inherit',
                },

                '& span.arrow': {
                    lineHeight: '14px'
                },

                '& Face': {
                    minWidth: 160
                },

                '& Title': {
                    display: 'flex',
                    height: 32,

                    '& Item': {
                        height: '14px',
                        lineHeight: '14px'
                    },

                    '& Right': {
                        lineHeight: '12px'
                    }
                }
            },

            '& .hasTimePicker': {
                height: 32,

                '& li': {
                    lineHeight: '14px'
                }

            },

            '& textarea': {
                marginBottom: 0,
                minWidth: 320
            }
        },

        '& .secondDateInput': {
            height: 32,
            margin: 'auto 0',

            '& Label': {
                width: 'auto',
                margin: 'auto 10px auto 20px',
            },
        },

        '& .secondInput': {
            height: 32,
            margin: 'auto 0',

            '& Label': {
                margin: 'auto 10px auto 20px',
            },

            '& Label:first-child': {
                '@media(max-width: 1440px)': {
                    width: 142,
                    marginRight: 0,
                },

            }
        },

        '& .wrappedToggle': {
            marginBottom: 10,
        },

        '& .rowsContainer': {
            display: 'flex',
            flexWrap: 'wrap',
            flex: 1,
        },

        '& .rowContainer': {
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'column',
        },

        '& .container1': {
            display: 'flex',
            flexWrap: 'wrap'
        },

        '& .container2': {
            display: 'flex',
            flexWrap: 'wrap',

            '@media(max-width: 1440px)': {
                margin: '10px auto auto 0',
                justifyContent: 'space-between',

                '& .performanceValue': {
                    '& label': {
                        marginLeft: 0,
                    }
                }
            },

            '& .cookiePeriodContainer': {
                position: 'relative',

                '& #cookiePeriodTooltip-help': {
                    position: 'absolute',
                    top: 0,
                    right: -40
                }
            }
        },

        '& .RateError': {
            marginLeft: 145,
            marginTop: -10,
            marginBottom :25,

            '& label': {
                width: 100
            }
        },

        '& .AddMore': {
            marginLeft: 145,
            marginTop: -15,
        },

        '& .addPartners': {
            margin: '0 auto 20px 0',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',

            '@media(max-width: 1440px)': {
                display: 'unset',
                position: 'relative',
            },

            '& .wrappedInput': {
                margin: 'auto 0',
            },

            '& .postLabelBox': {
                marginLeft: 5,
                display: 'flex',
                height: '100%'
            },

            '& .postLabel': {
                width: 'auto',
                margin: 'auto'
            },

            '& .small': {
                margin: 0,

                '& Input': {
                    minWidth: 112,
                    width: 112,
                },

                '& Button': {
                    minWidth: 112
                }
            },

            '& .InputSelectComponent': {
                width: 320,
                padding: 0,
            },

            '& .faceBox': {
                padding: '0',
                display: 'flex',
                flexWrap: 'wrap'
            },

            '& .tagBox': {
                margin: 'auto 2px auto 2px',
                maxWidth: 320
            },

            '& .tag': {
                minWidth: '90%',
                width: 'auto'
            },

            '& .tag:last-child:first-child': {
                margin: 'auto'
            },

            '& .InputForm': {
                maxHeight: 32,
                margin: 0
            },

            '& .triggerInput': {
                lineHeight: '16px'
            },

            '& svg.entypo--HelpWithCircle': {
                marginRight: 10
            }
        },

        '& .isCampaignRate': {
            backgroundColor: '#EAF3FF',
            borderRadius: 6,
            padding: '10px 20px',
            margin: '10px auto 0 122px',

            '& .container2': {
                '@media(max-width: 1440px)': {
                    margin: '10px auto auto 0',
                },
            },

            '& .CampaignLabelContainer': {
                display: 'flex',
                flexWrap: 'wrap',
                minWidth: 320,
                height: 32,
            },

            '& .CampaignLabelText': {
                margin: 'auto auto auto 0',
                fontWeight: 'bold'
            },

            '& Input': {
                backgroundColor: '#FFF',
                '&:focus ': {
                    backgroundColor: '#FFF',
                }
            },

            '& Button': {
                backgroundColor: '#FFF',
            },

            '& .RateError': {
                marginLeft: 0,
                marginBottom: 0,
                marginTop: 0
            },

            '& .addPartners': {
                marginBottom: 0
            }
        },

        '& .DeleteButton': {
            display: 'flex',
            flexWrap: 'wrap',
            margin: '0 0 0 10px',

            '@media(max-width: 1440px)': {
                margin: '0 0 0 0',
                position: 'absolute',
                top: 6,
                right: -56,
            },
        },

        '& .DeleteButtonText': {
            cursor: 'pointer',
            margin: '6px auto auto 33px',
            color: '#ff552a',

            '@media(max-width: 1440px)': {
                margin: 'auto auto auto 0'
            },
        },
    }
});
