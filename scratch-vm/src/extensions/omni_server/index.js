// omni: Added server support.

const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');
const Runtime = require('../../engine/runtime');
const Thread = require('../../engine/thread');

// Icon Credits: https://freesvg.org/server-icon-vector-image, dedicated to the public domain.
// eslint-disable-next-line max-len
const iconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgo8c3ZnCiAgICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICAgeG1sbnM6bnMxPSJodHRwOi8vc296aS5iYWllcm91Z2UuZnIiCiAgICB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIKICAgIGlkPSJzdmczMDcyIgogICAgc29kaXBvZGk6ZG9jbmFtZT0iU2VydmVyLnN2ZyIKICAgIHZpZXdCb3g9IjAgMCAxNjUuNjkgMjU2IgogICAgdmVyc2lvbj0iMS4xIgogICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40NyByMjI1ODMiCiAgPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICAgaWQ9ImJhc2UiCiAgICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgICBpbmtzY2FwZTp3aW5kb3cteT0iNjUiCiAgICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iNDc5IgogICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgICBpbmtzY2FwZTp6b29tPSIwLjkzNzQ5OTg5IgogICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMTc3NyIKICAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgICBib3JkZXJvcGFjaXR5PSIxLjAiCiAgICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIKICAgICAgaW5rc2NhcGU6Y3g9IjgyLjg0NDY4OCIKICAgICAgaW5rc2NhcGU6Y3k9IjEyOC4wMDAwMiIKICAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSI3NDEiCiAgICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgIGlua3NjYXBlOmRvY3VtZW50LXVuaXRzPSJweCIKICAvPgogIDxnCiAgICAgIGlkPSJsYXllcjEiCiAgICAgIGlua3NjYXBlOmxhYmVsPSJDYXBhIDEiCiAgICAgIGlua3NjYXBlOmdyb3VwbW9kZT0ibGF5ZXIiCiAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MDUuNzMgLTE0NC4zNikiCiAgICA+CiAgICA8ZwogICAgICAgIGlkPSJnMTAiCiAgICAgICAgY2xhc3M9IkdyYXBoaWMiCiAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4wNDIzIDAgMCAwLjA0MjMgMzE5LjM5IDU5LjEyOCkiCiAgICAgID4KICAgICAgPGcKICAgICAgICAgIGlkPSJnMTIiCiAgICAgICAgPgogICAgICAgIDxnCiAgICAgICAgICAgIGlkPSJnMTQiCiAgICAgICAgICAgIHN0eWxlPSJmaWxsOiNjN2M3YzciCiAgICAgICAgICA+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgIGlkPSJwYXRoMTYiCiAgICAgICAgICAgICAgZD0ibTU5MDMgMjM2MWM1MCA4MiAzNCAzOTk1LTMxIDQxNDktNTEgMTIyLTE3MDMgMTQ5NS0xNzg5IDE1MzEtMTExNy03LTE4NzAtNDE0LTE5OTUtNjI5LTQ4LTI3MC03LTQ0MzMgMzgtNDUyMCA0MC03NiAyMTUzLTgzMyAyMjI3LTg1MSA2Ny0xNSAxNDkzIDIyOSAxNTUwIDMyMHoiCiAgICAgICAgICAvPgogICAgICAgIDwvZwogICAgICAgID4KICAgICAgICA8ZwogICAgICAgICAgICBpZD0iZzE4IgogICAgICAgICAgICBzdHlsZT0iZmlsbDojMDAwMDAwIgogICAgICAgICAgPgogICAgICAgICAgPHBhdGgKICAgICAgICAgICAgICBpZD0icGF0aDIwIgogICAgICAgICAgICAgIGQ9Im01ODgxIDIzNzQgMi0xLTIgMmMwLTEtMS0xLTEtMXYtMmw3LTMtMiAyLTUgMSA1LTEtMiAyLTIgMXptMi0xIDItMiAyLTIgNS0yLTUgNCA1LTRoMWwtNiAzdjEtMWwtNCAzem0xMC02aC0xIDEtMWwxMS02LTEwIDV2MXptMTEtNC0xMSA0di0xbDExLTN6bTIwLTE1Yy0yLTMtNC02LTctOS0yLTMtNS01LTgtNy01LTQtMTItOC0yMC0xMi03LTQtMTUtNy0yNC0xMXMtMTktNy0zMC0xMWMtMjEtOC00Ny0xNi03NS0yNC0yOS04LTYxLTE2LTk1LTI1LTEzNi0zNC0zMTMtNzItNDk0LTEwNi0xODEtMzUtMzY0LTY2LTUxMS05MC03My0xMS0xMzgtMjEtMTg5LTI3LTI1LTMtNDctNi02NS04LTktMS0xNy0xLTI0LTItNCAwLTcgMC0xMC0xaC05Yy0zIDAtNSAwLTcgMWgtNGMtMiAwLTMgMC00IDEtMiAwLTQgMS03IDItMiAwLTUgMS04IDJzLTcgMi0xMSAzYy00IDItOCAzLTEzIDUtMTAgMy0yMiA3LTM1IDEyLTEzIDQtMjggOS00NCAxNS0zMyAxMS03MSAyNS0xMTUgNDAtNDMgMTUtOTEgMzItMTQ0IDUxLTIwOSA3NS00ODEgMTczLTc1MyAyNzQtMjcxIDEwMS01NDIgMjAzLTc0NyAyODUtNTEgMjEtOTggNDAtMTQwIDU3LTQzIDE4LTgwIDM0LTExMSA0OC0xNiA3LTMwIDE0LTQyIDIwLTEzIDYtMjQgMTItMzMgMTctNSAyLTkgNS0xMyA3LTQgMy04IDUtMTAgNy00IDMtNyA1LTkgNy01IDQtNyA4LTkgMTEtMSAyLTIgNS00IDkgMCAzLTEgNi0xIDktMSAzLTEgNy0yIDExcy0xIDgtMiAxM2MwIDktMSAyMC0zIDMyIDAgMTMtMSAyNy0yIDQyLTIgMzEtNCA2OS02IDExMS0yIDQzLTQgOTEtNSAxNDQtNyAyMTMtMTQgNTA0LTE5IDgzNS0xMSA2NjItMTkgMTQ4Mi0xOSAyMTQ0IDAgMzA4IDIgNTgzIDUgNzkxIDEgNTIgMiAxMDAgMyAxNDNzMyA4MiA0IDExNWMxIDM0IDMgNjIgNCA4NSAxIDEyIDIgMjIgMyAzMCAxIDUgMSA5IDEgMTMgMSAzIDIgNyAyIDEwbDEgNCAyIDRjOSAxNSAyMCAzMCAzMyA0NiAxNCAxNiAzMCAzMiA0OCA0OSAzNSAzMiA4MCA2NiAxMzUgMTAxIDEwNyA3MCAyNDkgMTQyIDQyMyAyMDcgMTczIDY1IDM3NyAxMjQgNjA4IDE2N3M0ODkgNzAgNzY5IDcyaDZsNS0yIDgtNGMyLTIgNS0zIDgtNiAzLTIgNi00IDEwLTZsMTItOWM5LTYgMTktMTMgMzAtMjIgMTEtOCAyMy0xNyAzNy0yOCAyNy0yMCA1OC00NSA5My03M3M3NC01OSAxMTYtOTNjMTY5LTEzNiAzODUtMzE1IDYwMC00OTcgMjE1LTE4MSA0MzAtMzY2IDU5My01MTIgNDEtMzcgNzktNzEgMTEzLTEwMyAzNC0zMSA2NC01OSA4OS04NCAxMy0xMyAyNC0yNCAzNC0zNSAxMS0xMSAyMC0yMCAyOC0yOXMxNC0xNyAxOS0yM2MzLTQgNS04IDctMTAgMi00IDQtOCA2LTExIDAtMiAxLTUgMi04czItNSAzLTljMS02IDItMTMgMy0yMiAyLTggMy0xNyA0LTI4czItMjIgMy0zNWMyLTI1IDQtNTUgNy04OSAxLTM0IDMtNzIgNS0xMTMgOC0xNjYgMTQtMzkxIDE5LTY0OCAxMC01MTYgMTYtMTE2NCAxNi0xNzQzIDAtMzg5LTMtNzQ3LTgtMTAxMi0xLTY2LTItMTI3LTQtMTgxLTEtNTMtMy0xMDAtNS0xMzktMS0yMC0yLTM4LTMtNTMtMS0xNi0yLTMwLTMtNDEtMS02LTEtMTEtMi0xNnMtMS0xMC0yLTEzYy0xLTQtMS04LTItMTEtMS0yLTEtNC0yLTUtMS0zLTItNS0zLTZ6bS0zNyAyMSAxMi0xMi0xMiAxMnptLTYgOWMxIDMgMSA3IDIgMTEgMCA0IDEgOSAxIDE1IDEgMTEgMyAyNCA0IDM5IDAgMTUgMSAzMyAyIDUyIDIgMzkgNCA4NiA2IDEzOSAxIDUzIDIgMTE0IDQgMTgwIDUgMjY0IDcgNjIyIDcgMTAxMSAwIDU3OC01IDEyMjctMTUgMTc0Mi02IDI1Ny0xMiA0ODEtMTkgNjQ2LTIgNDItNCA3OS02IDExMy0yIDMzLTQgNjMtNiA4OC0xIDEyLTIgMjQtNCAzNCAwIDEwLTIgMTgtMyAyNi0xIDctMiAxNC0zIDE4IDAgMy0xIDQtMSA2IDAgMS0xIDItMSAyIDAgMS0xIDItMiA0LTEgMS0zIDQtNCA2LTUgNi0xMCAxMy0xNyAyMS03IDctMTYgMTctMjYgMjdsLTM0IDM0Yy0yNSAyNC01NCA1Mi04OCA4My0zMyAzMS03MSA2Ni0xMTIgMTAyLTE2MyAxNDYtMzc3IDMzMC01OTIgNTEyLTIxNSAxODEtNDMxIDM2MC01OTggNDk1LTQyIDM0LTgxIDY1LTExNiA5M3MtNjYgNTItOTMgNzNjLTEzIDEwLTI2IDIwLTM3IDI4LTEwIDgtMjAgMTUtMjggMjEtNCAzLTggNi0xMiA4LTMgMi02IDQtOCA2LTIgMS00IDItNSAzLTI3Ni0yLTUyOC0yOS03NTUtNzEtMjI4LTQyLTQyOS0xMDAtNjAwLTE2NC0xNjktNjQtMzA4LTEzNC00MTMtMjAyLTUxLTMzLTk0LTY2LTEyOC05Ny0xNy0xNS0zMS0zMC00My00NC0xMC0xMi0xOS0yMy0yNi0zNHYtNGMtMS0zLTEtNy0xLTExLTEtOC0yLTE4LTMtMjgtMi0yMy0zLTUxLTUtODQtMS0zMy0yLTcxLTMtMTE1LTEtNDItMi05MC0zLTE0Mi0zLTIwOC01LTQ4Mi01LTc5MCAwLTY2MiA3LTE0ODEgMTgtMjE0MyA2LTMzMCAxMi02MjIgMTktODM0IDItNTMgNC0xMDEgNi0xNDQgMi00MiAzLTc5IDUtMTA5IDEtMTYgMi0zMCAzLTQyczItMjIgMy0zMWMwLTQgMS04IDEtMTEgMS00IDEtNiAyLTl2LTJjMC0xIDEtMSAyLTIgMi0xIDQtMyA3LTUgNC0xIDctNCAxMS02IDktNSAxOS0xMCAzMS0xNnMyNi0xMiA0MS0xOWMzMS0xNCA2Ny0yOSAxMDktNDcgNDItMTcgODktMzcgMTQwLTU3IDIwNS04MiA0NzUtMTg0IDc0Ni0yODQgMjcxLTEwMSA1NDMtMjAwIDc1Mi0yNzQgNTItMTkgMTAxLTM2IDE0NC01MSA0My0xNiA4Mi0yOSAxMTQtNDAgMTctNiAzMS0xMSA0NC0xNiAxMy00IDI1LTggMzUtMTEgNC0yIDktMyAxMy00IDQtMiA3LTMgMTAtNHM1LTEgOC0ybDMtMS0yLTggMSA4aDEgNCA3YzIgMCA1IDAgOCAxIDcgMCAxNCAxIDIzIDIgMTcgMSAzOSA0IDY0IDcgNTAgNiAxMTQgMTYgMTg3IDI3IDE0NyAyMyAzMjkgNTUgNTA5IDg5IDE4MCAzNSAzNTcgNzIgNDkyIDEwNiAzNCA5IDY1IDE3IDkyIDI1IDI4IDggNTMgMTUgNzMgMjMgMTAgMyAyMCA3IDI4IDEwIDcgMyAxNSA2IDIwIDlzMTAgNSAxMyA4YzAgMCAxIDAgMSAxczEgMyAxIDR6bS0xODA2IDU2MzljMSAwIDEtMSAyLTFoNnYxNGwtOC0xMyA4IDEzdjExbC0xMC0yM3MxLTEgMi0xem0tMTk2NS02MTdjMSAxIDEgMyAyIDRzMSAzIDEgNGwtMjUgNCAyMS0xMSAxLTEtMSAxIDEtMWgyLTJ6bTM5LTQ0OTh2M2MtMSAwLTEgMS0yIDFsLTUtNi0xNy00IDE3IDQtMi0xIDQgMiA1IDF6bS03LTIgMiAxLTItMXptLTE2LTggMTQgNy0xNC03em0xNCA3LTEwLTExIDEwIDExem0yMjE3LTg0MS0yLTE3IDIgMTd6bS00LTE3IDQgMTd2MWwtNC0xOHoiCiAgICAgICAgICAvPgogICAgICAgIDwvZwogICAgICAgID4KICAgICAgICA8ZwogICAgICAgICAgICBpZD0iZzIyIgogICAgICAgICAgICBzdHlsZT0ic3Ryb2tlOiNmZmZmZmY7ZmlsbC1vcGFjaXR5Oi41NDExODtzdHJva2Utb3BhY2l0eTouNTQxMTg7ZmlsbDojZmZmZmZmIgogICAgICAgICAgPgogICAgICAgICAgPHBhdGgKICAgICAgICAgICAgICBpZD0icGF0aDI0IgogICAgICAgICAgICAgIGQ9Im01ODIyIDI0NDItNTIgMjItNTIgMjMtNTIgMjMtNTMgMjUtNTMgMjUtNTMgMjYtNTMgMjYtNTQgMjctNTQgMjctNTQgMjgtNTUgMjgtNTQgMjktNTUgMjktNTUgMjktMTExIDYwLTExMiA2MC0xMTIgNjAtMTEzIDYxLTExNCA2MC0xMTQgNjAtMTE0IDU5LTU3IDI5LTU3IDI5LTU4IDI4LTU3IDI4LTI3LTYtMjgtNy01Ni0xMy01OC0xNC01OS0xMy02MC0xNC02MS0xNC02MS0xNC02My0xNC02Mi0xNC02My0xNS0xMjctMjgtMTI3LTI4LTY0LTE0LTYzLTE0LTYyLTEzLTYyLTEzLTYxLTEzLTYwLTEzLTYwLTEzLTU4LTEyLTU3LTEyLTI4LTUtMjgtNi0yNy01LTI3LTYtMjctNS0yNi01LTI2LTUtMjUtNi0yNS00LTI0LTUtMjQtNS0yNC00LTIzLTQtMjItNS0yMi00LTIxLTMtMjEtNC0yMC00IDUyIDE2IDUyIDE2IDUzIDE2IDU0IDE1IDU1IDE2IDU1IDE1IDU3IDE2IDU2IDE1IDU3IDE2IDU4IDE1IDExNiAzMSAxMTcgMzAgMTE4IDMxIDExOCAzMSAxMTcgMzAgMTE2IDMxIDU4IDE1IDU3IDE2IDU3IDE1IDU2IDE2IDU1IDE1IDU1IDE2IDU0IDE1IDUzIDE2IDUyIDE2IDUyIDE2IDEgNjAgMiA2MSAxIDYxIDEgNjMgMSA2NCAyIDY0IDEgNjUgMSA2NiAxIDY3IDEgNjcgMSA2OHY2OWwxIDY5IDEgNzAgMSA3MHY3MWwxIDcxdjcybDEgNzIgMSA3MyAxIDE0NiAxIDE0N3YxNDlsMSAxNDkgMiAyOTkgMSAzMDAgMSAxNDkgMSAxNDggMSAxNDcgMSAxNDYgMSA3M3Y3MmwxIDcyIDEgNzF2NzFsMSA3MSAxIDY5IDEgNzB2NjhsMSA2OCAxIDY3IDEgNjcgMSA2NiAxIDY1IDEgNjUgMiA2MyAxIDYzIDEgNjIgMiA2MSAxIDYwIDEtNjEgMS02MXYtNjNsMS02MyAxLTY0IDEtNjUgMS02NiAxLTY3IDEtNjcgMS02OCAxLTY5IDItNjkgMS03MCAxLTcxIDEtNzEgMS03MiAxLTcyIDItNzMgMS03MyAxLTczIDMtMTQ4IDMtMTQ5IDItMTUxIDMtMTUxIDYtMzAzIDUtMzAzIDMtMTUxIDMtMTUwIDItMTQ5IDMtMTQ5IDEtNzMgMi03MyAxLTczIDEtNzIgMS03MSAxLTcyIDEtNzAgMi03MCAxLTcwIDEtNjggMS02OCAxLTY4IDEtNjYgMS02NiAxLTY1IDEtNjQgMS02NHYtNjJsMS02MiAxLTYwIDExMC01OSAxMDktNTkgMTA5LTU3IDEwOS01OCAxMDgtNTcgMTA3LTU4IDEwNy01NyAxMDctNTggMTA1LTU4IDEwNS01OCAxMDQtNjAgMTAzLTYwIDUxLTMwIDUwLTMxIDUxLTMxIDUwLTMxIDUwLTMxIDUwLTMyIDQ5LTMyIDUwLTMyeiIKICAgICAgICAgIC8+CiAgICAgICAgPC9nCiAgICAgICAgPgogICAgICAgIDxnCiAgICAgICAgICAgIGlkPSJnMjgiCiAgICAgICAgICAgIHN0eWxlPSJmaWxsOm5vbmUiCiAgICAgICAgICA+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgIGlkPSJwYXRoMzAiCiAgICAgICAgICAgICAgZD0ibTU4MjIgMjQ0MmMtNTQ5IDIzMi0xMTU2IDYwNi0xNzY4IDkwMS01ODAtMTM4LTE0MTctMzIyLTE4MzktMzk2IDU0MyAxNjkgMTI1NyAzMjcgMTgwMCA0OTYgMzIgMTI3MSAxNiAzMTk2IDQ4IDQ0NjcgMTYtMTI4MiA1OS0zMjM4IDc1LTQ1MTkgNTg2LTMxNyAxMTYxLTYwMSAxNjg0LTk0OXoiCiAgICAgICAgICAvPgogICAgICAgIDwvZwogICAgICAgID4KICAgICAgICA8ZwogICAgICAgICAgICBpZD0iZzMyIgogICAgICAgICAgICBzdHlsZT0ic3Ryb2tlOiNmZmZmZmY7ZmlsbC1vcGFjaXR5Oi4xNjA3ODtzdHJva2Utb3BhY2l0eTouMTYwNzg7ZmlsbDojMDAwMDAwIgogICAgICAgICAgPgogICAgICAgICAgPHBhdGgKICAgICAgICAgICAgICBpZD0icGF0aDM0IgogICAgICAgICAgICAgIGQ9Im0yNDIwIDY2MjggMTAgMTQgMTAgMTMgMTEgMTMgMTIgMTMgMTIgMTIgMTIgMTIgMTQgMTIgMTMgMTIgMTQgMTIgMTUgMTEgMTUgMTEgMTYgMTEgMTUgMTEgMTcgMTAgMTYgMTAgMTcgMTEgMTggOSAxOCAxMCAxOCA5IDE4IDggMTkgOSAxOSA4IDE5IDggMTkgOCA0MCAxNSA0MCAxNCA0MSAxMiA0MSAxMSA0MiAxMCA0MSA5IDQyIDggNDEgNiA0MSA2IDQxIDMgMjEgMiAyMCAxIDE5IDFoMjAgMjAgMTlsMTktMSAxOS0xIDE4LTEgMTktMSAxNy0yIDE4LTMgMTctMiAxNy0zIDE3LTQgMTYtNCAxNS00IDE1LTQgMTUtNSAxNS01LTItMWgtMWwtNS0yLTYtMS03LTItOC0yLTEwLTMtMTAtMy0xMi0zLTEzLTQtMTQtMy0xNS00LTE2LTUtMTYtNC0xOC01LTE4LTUtMTktNS0yMC02LTIwLTUtMjEtNi0yMi02LTIyLTYtMjItNi0yMy03LTI0LTYtNDgtMTMtNDktMTQtNTAtMTQtNTAtMTMtNTAtMTUtNTAtMTMtNDktMTQtNDktMTMtMjMtNy0yNC02LTIzLTctMjItNi0yMi02LTIxLTYtMjEtNi0yMC01LTE5LTYtMTktNS0xOC01LTE3LTUtMTYtNC0xNS01LTE1LTQtMTMtNC0xMi0zLTEyLTMtMTAtMy05LTMtNy0yLTctMi01LTJoLTJsLTItMXoiCiAgICAgICAgICAvPgogICAgICAgIDwvZwogICAgICAgID4KICAgICAgICA8ZwogICAgICAgICAgICBpZD0iZzM4IgogICAgICAgICAgICBzdHlsZT0iZmlsbDpub25lIgogICAgICAgICAgPgogICAgICAgICAgPHBhdGgKICAgICAgICAgICAgICBpZD0icGF0aDQwIgogICAgICAgICAgICAgIGQ9Im0yNDIwIDY2MjhjMjAxIDI4OSA4MzMgNDMxIDExMzMgMzE1LTUzLTE0LTEwNjYtMjkzLTExMzMtMzE1eiIKICAgICAgICAgIC8+CiAgICAgICAgPC9nCiAgICAgICAgPgogICAgICAgIDxnCiAgICAgICAgICAgIGlkPSJnNDIiCiAgICAgICAgICAgIHN0eWxlPSJzdHJva2U6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6LjM4ODI0O3N0cm9rZS1vcGFjaXR5Oi4zODgyNDtmaWxsOiNmZmZmZmYiCiAgICAgICAgICA+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgIGlkPSJwYXRoNDQiCiAgICAgICAgICAgICAgZD0ibTM0NTQgNjA5My05MzYtMzYxLTkgNC04IDQtOCA0LTYgNS02IDYtNiA2LTUgNy01IDYtNCA3LTQgNy0zIDctMyA4LTMgOC0yIDctMyAxNS0yIDE1LTIgMTR2NiA3IDUgNiA1IDQgNGwxIDR2MiAyIDEgMWwxNDYgNTEgMSAxIDEgMSAxIDEgMSAyIDIgMiAxIDMgMyAzIDIgMyAzIDQgMyA0IDMgNCA0IDUgNCA0IDQgNiA1IDQgMTAgMTIgMTAgMTEgMTMgMTIgMTMgMTIgMTQgMTMgMTUgMTIgMTcgMTMgMTcgMTIgMTkgMTIgMTkgMTEgMjEgMTEgMjIgMTAgMTEgNCAxMSA1IDEyIDQgMTIgNCAxMyAzIDEyIDMgMTMgMyAxMyAzIDEzIDIgMTMgMSAxNCAyIDE0IDFoMTQgMTUgMTVsMTUtMSAxNS0yIDE1LTIgMTYtMiAxNi0zIDE2LTQgMTYtNCAxNy01IDE3LTZoMWwyIDFoM2w2IDEgNiAxIDcgMSA4IDEgOSAxIDEwIDEgMTEgMSAxMiAxIDEyIDFoMTJsMTMgMWgyNmwxNC0xIDEzLTEgMTQtMSAxMy0yIDEzLTIgMTItMyAxMi0zIDEyLTMgMTAtNSAxMS01IDktNiA4LTYgOC04IDMtNCAzLTQgMy00IDItNCAyLTUgMi01eiIKICAgICAgICAgIC8+CiAgICAgICAgPC9nCiAgICAgICAgPgogICAgICAgIDxnCiAgICAgICAgICAgIGlkPSJnNDgiCiAgICAgICAgICAgIHN0eWxlPSJmaWxsOm5vbmUiCiAgICAgICAgICA+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgIGlkPSJwYXRoNTAiCiAgICAgICAgICAgICAgZD0ibTM0NTQgNjA5My05MzYtMzYxYy05NyAzNC03OCAxNzctNzggMTc3bDE0NiA1MXMyMDQgMzE5IDU2NiAxOTRjMCAwIDI2OSA0OCAzMDItNjF6IgogICAgICAgICAgLz4KICAgICAgICA8L2cKICAgICAgICA+CiAgICAgICAgPGcKICAgICAgICAgICAgaWQ9Imc1MiIKICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzYwNjA2MCIKICAgICAgICAgID4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICAgaWQ9InBhdGg1NCIKICAgICAgICAgICAgICBkPSJtMzQ0NiA1OTcxYy0zMTEtODEtNjIyLTE2MS05MzMtMjQyLTEyIDQ0LTEzIDEwNyA2IDE0MCA0NyAyMyAxNDIgNDEgMTg5IDY0IDEzNiAxMzEgMjU1IDE0MiA0NzIgMTI0IDg0IDE3IDE2OCAzMSAyNTEgNDggMjYtNTEgMzMtNzIgMTUtMTM0eiIKICAgICAgICAgIC8+CiAgICAgICAgPC9nCiAgICAgICAgPgogICAgICAgIDxnCiAgICAgICAgICAgIGlkPSJnNTYiCiAgICAgICAgICAgIHN0eWxlPSJmaWxsOm5vbmUiCiAgICAgICAgICA+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgIGlkPSJwYXRoNTgiCiAgICAgICAgICAgICAgZD0ibTM0NDYgNTk3MWMtMzExLTgxLTYyMi0xNjEtOTMzLTI0Mi0xMiA0NC0xMyAxMDcgNiAxNDAgNDcgMjMgMTQyIDQxIDE4OSA2NCAxMzYgMTMxIDI1NSAxNDIgNDcyIDEyNCA4NCAxNyAxNjggMzEgMjUxIDQ4IDI2LTUxIDMzLTcyIDE1LTEzNHoiCiAgICAgICAgICAvPgogICAgICAgIDwvZwogICAgICAgID4KICAgICAgICA8ZwogICAgICAgICAgICBpZD0iZzYwIgogICAgICAgICAgICBzdHlsZT0ic3Ryb2tlOiNmZmZmZmY7ZmlsbC1vcGFjaXR5Oi40O3N0cm9rZS1vcGFjaXR5Oi40O2ZpbGw6I2ZmZmZmZiIKICAgICAgICAgID4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICAgaWQ9InBhdGg2MiIKICAgICAgICAgICAgICBkPSJtNTg1NiAyNDE0LTE4MTMgMTAxNyA3IDQ1NDkgMTc3NS0xNDk0IDMxLTQwNzJ6IgogICAgICAgICAgLz4KICAgICAgICA8L2cKICAgICAgICA+CiAgICAgICAgPGcKICAgICAgICAgICAgaWQ9Imc2NiIKICAgICAgICAgICAgc3R5bGU9ImZpbGw6bm9uZSIKICAgICAgICAgID4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICAgaWQ9InBhdGg2OCIKICAgICAgICAgICAgICBkPSJtNTg1NiAyNDE0LTE4MTMgMTAxNyA3IDQ1NDkgMTc3NS0xNDk0IDMxLTQwNzJ6IgogICAgICAgICAgLz4KICAgICAgICA8L2cKICAgICAgICA+CiAgICAgICAgPGcKICAgICAgICAgICAgaWQ9Imc3MCIKICAgICAgICAgICAgc3R5bGU9InN0cm9rZTojZmZmZmZmO2ZpbGwtb3BhY2l0eTouMTYwNzg7c3Ryb2tlLW9wYWNpdHk6LjE2MDc4O2ZpbGw6IzAwMDAwMCIKICAgICAgICAgID4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICAgaWQ9InBhdGg3MiIKICAgICAgICAgICAgICBkPSJtMjUyNSA2OTE2IDEwIDEzIDExIDEyIDEwIDEzIDExIDExIDExIDEyIDExIDExIDEyIDExIDEyIDEwIDEyIDEwIDEyIDEwIDEzIDEwIDEyIDkgMTMgOSAxMyA4IDI3IDE3IDI4IDE1IDI4IDE0IDI4IDEzIDI5IDExIDI5IDExIDMwIDkgMzAgOCAyOSA4IDMwIDYgMzAgNSAzMCA0IDMwIDMgMzAgMiAyOSAyaDI5bDI5LTEgMjctMiAyOC0yIDI3LTMgMjYtNSAyNS01IDI0LTYgMjQtNiAyMi04LTItMWgtNGwtNC0yLTUtMS02LTItOC0yLTgtMi05LTItMTAtMy0xMC0zLTExLTMtMTItMy0xMy00LTEzLTMtMTQtNC0xNS00LTE1LTQtMTUtNS0xNi00LTE2LTUtMTctNC0xOC01LTM1LTEwLTM2LTEwLTM4LTEwLTM4LTEwLTM4LTExLTc2LTIxLTM3LTEwLTM3LTExLTM2LTEwLTE3LTQtMTctNS0xNy01LTE2LTQtMTYtNS0xNS00LTE1LTQtMTQtNC0xNC00LTEzLTQtMTItMy0xMS0zLTEyLTMtMTAtMy05LTMtOC0yLTgtMy03LTEtNi0yLTUtMi00LTEtMy0xeiIKICAgICAgICAgIC8+CiAgICAgICAgPC9nCiAgICAgICAgPgogICAgICAgIDxnCiAgICAgICAgICAgIGlkPSJnNzYiCiAgICAgICAgICAgIHN0eWxlPSJmaWxsOm5vbmUiCiAgICAgICAgICA+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgIGlkPSJwYXRoNzgiCiAgICAgICAgICAgICAgZD0ibTI1MjUgNjkxNmMyMDkgMjc2IDYyNyAzMjMgODYxIDIzOS0zOS0xMC04MTAtMjIyLTg2MS0yMzl6IgogICAgICAgICAgLz4KICAgICAgICA8L2cKICAgICAgICA+CiAgICAgICAgPGcKICAgICAgICAgICAgaWQ9Imc4MCIKICAgICAgICAgICAgc3R5bGU9InN0cm9rZTojZmZmZmZmO2ZpbGwtb3BhY2l0eTouMTYwNzg7c3Ryb2tlLW9wYWNpdHk6LjE2MDc4O2ZpbGw6IzAwMDAwMCIKICAgICAgICAgID4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICAgaWQ9InBhdGg4MiIKICAgICAgICAgICAgICBkPSJtMjY4MCA3MTk5IDEyIDE1IDEyIDE0IDEzIDE0IDE0IDEyIDE0IDEzIDE0IDExIDE1IDExIDE2IDExIDE1IDkgMTcgOSAxNiA5IDE3IDcgMTggNyAxNyA3IDE4IDUgMTggNSAxOCA1IDE5IDMgMTggNCAxOSAyIDE4IDIgMTkgMWgxOSAxOWwxOC0xIDE5LTIgMTgtMiAxOS0zIDE4LTQgMTgtNCAxOC01IDE3LTZoLTFsLTItMWgtM2wtNC0xLTMtMS01LTItNS0xLTYtMi02LTEtNi0yLTctMi04LTItOC0yLTgtMy05LTItOS0yLTE5LTYtMjAtNS0yMi02LTIyLTYtMjMtNi0yMy03LTQ4LTEzLTQ4LTEzLTIzLTctMjMtNi0yMy02LTIxLTYtMjEtNi0xOS02LTktMi05LTMtOS0yLTgtMi04LTItNy0yLTctMi02LTItNi0yLTUtMi01LTEtNS0xLTMtMS0zLTEtMy0xaC0yeiIKICAgICAgICAgIC8+CiAgICAgICAgPC9nCiAgICAgICAgPgogICAgICAgIDxnCiAgICAgICAgICAgIGlkPSJnODYiCiAgICAgICAgICAgIHN0eWxlPSJmaWxsOm5vbmUiCiAgICAgICAgICA+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgIGlkPSJwYXRoODgiCiAgICAgICAgICAgICAgZD0ibTI2ODAgNzE5OWMxMjEgMTYzIDM1NSAyMTMgNTQwIDE0OS0yNS02LTUwNy0xMzktNTQwLTE0OXoiCiAgICAgICAgICAvPgogICAgICAgIDwvZwogICAgICAgID4KICAgICAgICA8ZwogICAgICAgICAgICBpZD0iZzkwIgogICAgICAgICAgICBzdHlsZT0ic3Ryb2tlOiNmZmZmZmY7ZmlsbC1vcGFjaXR5Oi40MzkyMjtzdHJva2Utb3BhY2l0eTouNDM5MjI7ZmlsbDojZmNmY2ZjIgogICAgICAgICAgPgogICAgICAgICAgPHBhdGgKICAgICAgICAgICAgICBpZD0icGF0aDkyIgogICAgICAgICAgICAgIGQ9Im0yMzU2IDMyNTktOTIgMTMtMTcgMjE3MyAxNDI1IDM5OSAzNS0xMTYtMTM2OS0zNjUgMTgtMjEwNHoiCiAgICAgICAgICAvPgogICAgICAgIDwvZwogICAgICAgID4KICAgICAgICA8ZwogICAgICAgICAgICBpZD0iZzk2IgogICAgICAgICAgICBzdHlsZT0iZmlsbDpub25lIgogICAgICAgICAgPgogICAgICAgICAgPHBhdGgKICAgICAgICAgICAgICBpZD0icGF0aDk4IgogICAgICAgICAgICAgIGQ9Im0yMzU2IDMyNTktOTIgMTMtMTcgMjE3MyAxNDI1IDM5OSAzNS0xMTYtMTM2OS0zNjUgMTgtMjEwNHoiCiAgICAgICAgICAvPgogICAgICAgIDwvZwogICAgICAgID4KICAgICAgICA8ZwogICAgICAgICAgICBpZD0iZzEwMCIKICAgICAgICAgICAgc3R5bGU9InN0cm9rZTojZmZmZmZmO2ZpbGwtb3BhY2l0eTouMjMxMzc7c3Ryb2tlLW9wYWNpdHk6LjIzMTM3O2ZpbGw6IzAwMDAwMCIKICAgICAgICAgID4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICAgaWQ9InBhdGgxMDIiCiAgICAgICAgICAgICAgZD0ibTM3MDAgNDA2NS0yIDYxLTEzNDAtMzg2IDEzNDIgMzI1eiIKICAgICAgICAgIC8+CiAgICAgICAgPC9nCiAgICAgICAgPgogICAgICAgIDxnCiAgICAgICAgICAgIGlkPSJnMTA2IgogICAgICAgICAgICBzdHlsZT0ic3Ryb2tlOiNmZmZmZmY7ZmlsbC1vcGFjaXR5Oi4yMzEzNztzdHJva2Utb3BhY2l0eTouMjMxMzc7ZmlsbDojMDAwMDAwIgogICAgICAgICAgPgogICAgICAgICAgPHBhdGgKICAgICAgICAgICAgICBpZD0icGF0aDEwOCIKICAgICAgICAgICAgICBkPSJtMzcyMCA0NTA3LTMgNjEtMTMzOS0zODYgMTM0MiAzMjV6IgogICAgICAgICAgLz4KICAgICAgICA8L2cKICAgICAgICA+CiAgICAgICAgPGcKICAgICAgICAgICAgaWQ9ImcxMTIiCiAgICAgICAgICAgIHN0eWxlPSJzdHJva2U6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6LjIzMTM3O3N0cm9rZS1vcGFjaXR5Oi4yMzEzNztmaWxsOiMwMDAwMDAiCiAgICAgICAgICA+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgIGlkPSJwYXRoMTE0IgogICAgICAgICAgICAgIGQ9Im0zNzAwIDQ5MTYtMiA2MS0xMzQwLTM4NiAxMzQyIDMyNXoiCiAgICAgICAgICAvPgogICAgICAgIDwvZwogICAgICAgID4KICAgICAgICA8ZwogICAgICAgICAgICBpZD0iZzExOCIKICAgICAgICAgICAgc3R5bGU9InN0cm9rZTojZmZmZmZmO2ZpbGwtb3BhY2l0eTouMjMxMzc7c3Ryb2tlLW9wYWNpdHk6LjIzMTM3O2ZpbGw6IzAwMDAwMCIKICAgICAgICAgID4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICAgaWQ9InBhdGgxMjAiCiAgICAgICAgICAgICAgZD0ibTM3MDAgNTMxOC0yIDYxLTEzNDAtMzg3IDEzNDIgMzI2eiIKICAgICAgICAgIC8+CiAgICAgICAgPC9nCiAgICAgICAgPgogICAgICAgIDxnCiAgICAgICAgICAgIGlkPSJnMTI0IgogICAgICAgICAgICBzdHlsZT0iZmlsbDojOWU5ZTllIgogICAgICAgICAgPgogICAgICAgICAgPHBhdGgKICAgICAgICAgICAgICBpZD0icGF0aDEyNiIKICAgICAgICAgICAgICBkPSJtMjM2MSAzMzA5IDEzMzIgMzMzLTExIDIxOTdoMTEgMTFsMTEtMjIwNXYtOWwtOC0yLTEzNDEtMzM1LTIgMTEtMyAxMHptMTM0MCAzMzUtOC0ydi04aDExbC0zIDEweiIKICAgICAgICAgIC8+CiAgICAgICAgPC9nCiAgICAgICAgPgogICAgICA8L2cKICAgICAgPgogICAgPC9nCiAgICA+CiAgPC9nCiAgPgogIDxtZXRhZGF0YQogICAgPgogICAgPHJkZjpSREYKICAgICAgPgogICAgICA8Y2M6V29yawogICAgICAgID4KICAgICAgICA8ZGM6Zm9ybWF0CiAgICAgICAgICA+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0CiAgICAgICAgPgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiCiAgICAgICAgLz4KICAgICAgICA8Y2M6bGljZW5zZQogICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL3B1YmxpY2RvbWFpbi8iCiAgICAgICAgLz4KICAgICAgICA8ZGM6cHVibGlzaGVyCiAgICAgICAgICA+CiAgICAgICAgICA8Y2M6QWdlbnQKICAgICAgICAgICAgICByZGY6YWJvdXQ9Imh0dHA6Ly9vcGVuY2xpcGFydC5vcmcvIgogICAgICAgICAgICA+CiAgICAgICAgICAgIDxkYzp0aXRsZQogICAgICAgICAgICAgID5PcGVuY2xpcGFydDwvZGM6dGl0bGUKICAgICAgICAgICAgPgogICAgICAgICAgPC9jYzpBZ2VudAogICAgICAgICAgPgogICAgICAgIDwvZGM6cHVibGlzaGVyCiAgICAgICAgPgogICAgICAgIDxkYzp0aXRsZQogICAgICAgICAgPlNlcnZlcjwvZGM6dGl0bGUKICAgICAgICA+CiAgICAgICAgPGRjOmRhdGUKICAgICAgICAgID4yMDExLTA4LTEyVDIwOjQxOjE0PC9kYzpkYXRlCiAgICAgICAgPgogICAgICAgIDxkYzpkZXNjcmlwdGlvbgogICAgICAgICAgPkNsaXBhcnQgZm9yIGNvbXB1dGVyIGFuZCBuZXR3b3JrIGRpYWdyYW1zPC9kYzpkZXNjcmlwdGlvbgogICAgICAgID4KICAgICAgICA8ZGM6c291cmNlCiAgICAgICAgICA+aHR0cHM6Ly9vcGVuY2xpcGFydC5vcmcvZGV0YWlsLzE1NTEwMS9zZXJ2ZXItYnktc2Fpc3l1a3VzYW5hZ2k8L2RjOnNvdXJjZQogICAgICAgID4KICAgICAgICA8ZGM6Y3JlYXRvcgogICAgICAgICAgPgogICAgICAgICAgPGNjOkFnZW50CiAgICAgICAgICAgID4KICAgICAgICAgICAgPGRjOnRpdGxlCiAgICAgICAgICAgICAgPnNhaXN5dWt1c2FuYWdpPC9kYzp0aXRsZQogICAgICAgICAgICA+CiAgICAgICAgICA8L2NjOkFnZW50CiAgICAgICAgICA+CiAgICAgICAgPC9kYzpjcmVhdG9yCiAgICAgICAgPgogICAgICAgIDxkYzpzdWJqZWN0CiAgICAgICAgICA+CiAgICAgICAgICA8cmRmOkJhZwogICAgICAgICAgICA+CiAgICAgICAgICAgIDxyZGY6bGkKICAgICAgICAgICAgICA+Q29tcHV0ZXI8L3JkZjpsaQogICAgICAgICAgICA+CiAgICAgICAgICAgIDxyZGY6bGkKICAgICAgICAgICAgICA+TmV0d29yazwvcmRmOmxpCiAgICAgICAgICAgID4KICAgICAgICAgICAgPHJkZjpsaQogICAgICAgICAgICAgID5TZXJ2ZXI8L3JkZjpsaQogICAgICAgICAgICA+CiAgICAgICAgICA8L3JkZjpCYWcKICAgICAgICAgID4KICAgICAgICA8L2RjOnN1YmplY3QKICAgICAgICA+CiAgICAgIDwvY2M6V29yawogICAgICA+CiAgICAgIDxjYzpMaWNlbnNlCiAgICAgICAgICByZGY6YWJvdXQ9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL3B1YmxpY2RvbWFpbi8iCiAgICAgICAgPgogICAgICAgIDxjYzpwZXJtaXRzCiAgICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjUmVwcm9kdWN0aW9uIgogICAgICAgIC8+CiAgICAgICAgPGNjOnBlcm1pdHMKICAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNEaXN0cmlidXRpb24iCiAgICAgICAgLz4KICAgICAgICA8Y2M6cGVybWl0cwogICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zI0Rlcml2YXRpdmVXb3JrcyIKICAgICAgICAvPgogICAgICA8L2NjOkxpY2Vuc2UKICAgICAgPgogICAgPC9yZGY6UkRGCiAgICA+CiAgPC9tZXRhZGF0YQogID4KPC9zdmcKPg==';

const REQ_METHOD_LIST = [
    'GET',
    'HEAD',
    'OPTIONS',
    'TRACE',
    'PUT',
    'DELETE',
    'POST',
    'PATCH',
    'CONNECT'
];

/**
 * omni: Blocks to provide the front-end for OmniBlocks server support.
 * @constructor
 */
class Server {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this.fileAccessError = false;

        this.runtime.on(Runtime.SERVER_REQUEST, (page, ip, method, headers, data, id) => {
            this.request = {
                id,
                page,
                ip,
                method,
                headers,
                data
            };

            const startedThreads = runtime.startHats('server_whenPageIsRequested');
            const threadStatuses = startedThreads.map(thread => thread.status);

            // If all threads are done immediately after the hat was started, that likely
            // means there is no handling for that particular page; and because of that,
            // we treat it as if the page was not found.
            if (threadStatuses.every(status => (status === Thread.STATUS_DONE))) {
                runtime.startHats('server_whenPageIsNotFound');
            }

            this.request = null;
        });
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'server',
            name: 'Web Server',
            color1: '#7000d9',
            color2: '#5400a3',
            color3: '#39006e',
            menuIconURI: iconURI,
            blockIconURI: iconURI,
            blocks: [
                {
                    opcode: 'whenPageIsRequested',
                    text: formatMessage({
                        id: 'omni_server.blocks.whenPageIsRequested',
                        default: 'when page [PAGE] is requested',
                        description: 'Hat that executes the code under it when a certain page is requested.'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        PAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: '/'
                        }
                    },
                    isEdgeActivated: false
                },
                {
                    opcode: 'whenPageIsNotFound',
                    text: formatMessage({
                        id: 'omni_server.blocks.whenPageIsNotFound',
                        default: 'when page is not found',
                        description: 'Hat that executes the code under it when a certain page is not found.'
                    }),
                    blockType: BlockType.HAT,
                    isEdgeActivated: false
                },
                '---',
                {
                    opcode: 'returnContent',
                    text: formatMessage({
                        id: 'omni_server.blocks.returnContent',
                        // eslint-disable-next-line max-len
                        default: 'return content [CONTENT] as [MIME] with the status [STATUS] and headers [EXTRA_HEADERS]',
                        description: 'Hat that executes the code under it when a certain page is requested.'
                    }),
                    blockType: BlockType.COMMAND,
                    isTerminal: true,
                    arguments: {
                        CONTENT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello OmniBlocks!'
                        },
                        MIME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'text/plain',
                            menu: 'MIME_MENU'
                        },
                        STATUS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '200'
                        },
                        EXTRA_HEADERS: {
                            type: ArgumentType.STRING,
                            defaultValue: '{}'
                        }
                    },
                    hideFromPalette: true // Hidden because it is a legacy block.
                },
                {
                    opcode: 'returnRequest',
                    text: formatMessage({
                        id: 'omni_server.blocks.returnRequest',
                        default: 'return content [CONTENT]',
                        description: 'Block that sends the requested HTTP response.'
                    }),
                    blockType: BlockType.COMMAND,
                    isTerminal: true,
                    arguments: {
                        CONTENT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello OmniBlocks!'
                        }
                    }
                },
                {
                    opcode: 'setMime',
                    text: formatMessage({
                        id: 'omni_server.blocks.setMime',
                        default: 'set format to [MIME]',
                        description: 'Block that sets the sent MIME (a.k.a. format) to a MIME-type.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MIME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'text/plain',
                            menu: 'MIME_MENU'
                        }
                    }
                },
                {
                    opcode: 'setStatus',
                    text: formatMessage({
                        id: 'omni_server.blocks.setStatus',
                        default: 'set status to [STATUS]',
                        description: 'Block that sets a HTTP status.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        STATUS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '200'
                        }
                    }
                },
                {
                    opcode: 'setHeaders',
                    text: formatMessage({
                        id: 'omni_server.blocks.setHeaders',
                        default: 'set headers to [EXTRA_HEADERS]',
                        description: 'Block that sets HTTP headers.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        EXTRA_HEADERS: {
                            type: ArgumentType.STRING,
                            defaultValue: '{}'
                        }
                    }
                },
                '---',
                {
                    opcode: 'page',
                    text: formatMessage({
                        id: 'omni_server.blocks.page',
                        default: 'page',
                        description: 'Block that returns the requested page URL.'
                    }),
                    blockType: BlockType.REPORTER,
                    disableMonitor: true
                },
                {
                    opcode: 'ipAddress',
                    text: formatMessage({
                        id: 'omni_server.blocks.ipAddress',
                        default: 'ip address',
                        description: 'Block that returns the IP Address from the request.'
                    }),
                    blockType: BlockType.REPORTER,
                    disableMonitor: true
                },
                {
                    opcode: 'method',
                    text: formatMessage({
                        id: 'omni_server.blocks.method',
                        default: 'request method',
                        description: 'Block that returns the request method.'
                    }),
                    blockType: BlockType.REPORTER,
                    hideFromPalette: true // Hidden because it is a legacy block.
                },
                {
                    opcode: 'headers',
                    text: formatMessage({
                        id: 'omni_server.blocks.headers',
                        default: 'request headers',
                        description: 'Block that returns the request headers.'
                    }),
                    blockType: BlockType.REPORTER,
                    disableMonitor: true
                },
                {
                    opcode: 'data',
                    text: formatMessage({
                        id: 'omni_server.blocks.data',
                        default: 'request data',
                        description: 'Block that returns the request data.'
                    }),
                    blockType: BlockType.REPORTER,
                    disableMonitor: true
                },
                '---',
                {
                    opcode: 'checkMethod',
                    text: formatMessage({
                        id: 'omni_server.blocks.checkMethod',
                        default: 'request method is [REQ_METHOD]?',
                        description: 'Block that checks the request method is equal to the selected request method.'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        REQ_METHOD: {
                            type: ArgumentType.STRING,
                            defaultValue: 'GET',
                            menu: 'REQ_METHOD_MENU'
                        }
                    }
                },
                '---',
                {
                    opcode: 'readFile',
                    text: formatMessage({
                        id: 'omni_server.blocks.readFile',
                        default: 'read file from [PATH]',
                        description: 'Block that reads a file.'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        PATH: {
                            type: ArgumentType.STRING,
                            defaultValue: '/home/user/apple.banana'
                        }
                    }
                },
                {
                    opcode: 'writeFile',
                    text: formatMessage({
                        id: 'omni_server.blocks.writeFile',
                        default: 'write [CONTENT] to [PATH]',
                        description: 'Block that writes content to a file.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PATH: {
                            type: ArgumentType.STRING,
                            defaultValue: '/home/user/apple.banana'
                        },
                        CONTENT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'apple'
                        }
                    }
                },
                {
                    opcode: 'fileAccessStatus',
                    text: formatMessage({
                        id: 'omni_server.blocks.fileAccessStatus',
                        default: 'failed to access file?',
                        description: 'Block that checks if the was an error while accessing a file.'
                    }),
                    blockType: BlockType.BOOLEAN
                }
            ],
            menus: {
                MIME_MENU: {
                    items: [
                        'text/plain',
                        'text/html',
                        'text/css',
                        'text/javascript',
                        'application/xml',
                        'application/json'
                    ],
                    acceptReporters: true
                },
                REQ_METHOD_MENU: {
                    items: REQ_METHOD_LIST
                }
            }
        };
    }


    whenPageIsRequested ({PAGE}, util) {
        const thread = util.thread;
        if (PAGE === this.request?.page) {
            thread.serverRequest = this.request;
            thread.serverResponse.status = 200;
            return true;
        }
        return false;
    }

    whenPageIsNotFound (args, util) {
        const thread = util.thread;
        thread.serverRequest = this.request;
        thread.serverResponse.status = 404;
        this.request = null;
        return true;
    }


    returnContent ({CONTENT, MIME, STATUS, EXTRA_HEADERS}, util) {
        const thread = util.thread;
        if (!thread.serverRequest) return; // Do absolutely nothing in the browser.
        this.runtime.emit(Runtime.SERVER_RESPONSE, CONTENT, MIME, STATUS, EXTRA_HEADERS, thread.serverRequest.id);
        // No script stopping is intended behaviour for backwards compatibility.
    }

    returnRequest ({CONTENT}, util) {
        const thread = util.thread;
        if (!thread.serverRequest) return; // Do absolutely nothing in the browser.
        this.runtime.emit(
            Runtime.SERVER_RESPONSE,
            Cast.toString(CONTENT),
            Cast.toString(thread.serverResponse.mime),
            Cast.toNumber(thread.serverResponse.status),
            Cast.toString(thread.serverResponse.headers),
            thread.serverRequest.id
        );
        thread.stopThisScript();
    }

    setMime ({MIME}, util) {
        const thread = util.thread;
        thread.serverResponse.mime = MIME;
    }

    setStatus ({STATUS}, util) {
        const thread = util.thread;
        thread.serverResponse.status = STATUS;
    }

    setHeaders ({EXTRA_HEADERS}, util) {
        const thread = util.thread;
        thread.serverResponse.headers = EXTRA_HEADERS;
    }

    ipAddress (args, util) {
        const thread = util.thread;
        return thread.serverRequest.ip;
    }

    method (args, util) {
        const thread = util.thread;
        return thread.serverRequest.method;
    }

    checkMethod ({REQ_METHOD}, util) {
        const thread = util.thread;
        if (!REQ_METHOD_LIST.includes(REQ_METHOD)) return false;
        return thread.serverRequest.method === REQ_METHOD;
    }

    page (args, util) {
        const thread = util.thread;
        return thread.serverRequest.page;
    }

    headers (args, util) {
        const thread = util.thread;
        return thread.serverRequest.headers;
    }

    data (args, util) {
        const thread = util.thread;
        return thread.serverRequest.data;
    }

    async readFile ({PATH}) {
        // Bail out if not privileged.
        if (!this.runtime.isPrivileged) return '';
        try {
            const file = await this.runtime.privilegedUtils.readFile(PATH);
            this.fileAccessError = false;
            return file;
        } catch {
            this.fileAccessError = true;
            return '';
        }
    }

    async writeFile ({PATH, CONTENT}) {
        // Bail out if not privileged.
        if (!this.runtime.isPrivileged) return;
        try {
            await this.runtime.privilegedUtils.writeFile(PATH, CONTENT);
            this.fileAccessError = false;
        } catch {
            this.fileAccessError = true;
        }
    }

    fileAccessStatus () {
        return this.fileAccessError;
    }
}

module.exports = Server;
