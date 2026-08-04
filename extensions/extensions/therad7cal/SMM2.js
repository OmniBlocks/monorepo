// Name: Super Mario Maker 2 Blocks
// ID: marioapi
// Description: Interact with the Super Mario Maker 2 API. Not affiliated with Nintendo.
// By: Radical <https://scratch.mit.edu/users/MrDrProfessorRadical>
// License: MIT

(function (Scratch){
    'use strict';

    // This is for IntelliSense type things.
    // const VM = require('scratch-vm');
    // const vm = new VM();
    let userInfoResponse = null;
    let userStats = null;
    const baseAPIURL = "https://tgrcode.com/mm2/"
    const hammerIcon = "data:image/webp;base64,UklGRtIHAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSCUDAAABoHVtkyHZ1v9FRm0d27Zt27Zt27Z1ZZuXtm3b3DYyIr6Dnqo6WRExAWgzKQD0X+7Ue9/5ZcJHSyKhfF3lgse/nkCSwcGrItUSSSmppv8hYf6bPs8k6ebBzCcgklSrSpOgZmpNMMWn9MgW7HP0HBD0Kf2mmnPhJdfcaN+VkNpSnM2JzrrBzTHDIhvtefQltz3y1Ntf/jF6YmZw8DLQlqAf09ngleeHZTaMzJ/mR2oJrzXpHW45m3lEBEka354O0oriJuYm7sEWjQ8KWkxaYQd6k7YzD4c2EBUAi11tLNP52QBIDdEEYMFz3xrPYp07QXuJKgSznfHiODKsmMybeyUF0H+nhwczaB4s1vmWAEASTLX5VV+TNAuWHBwzHwSKRU7/gUG3YOnGY1ElbD2MEdnZQeOdSDjYmYPddH6QsJ6Fs6vBMXPjEWZ213g8fmV06i5MYped7+u4TgVHzvcno0N0Hvt9t4wPfdKt4BfP0btEjryf1q18WbeCgw+kd8n55kKjGR0y3tDv804F98KDtO4Ef50BJ3bIMx8DFpnI6IY5/YMtAP2Q3oGwIN/cBoDiFubi3MhJL+6YIAmKrRmFmZPjnlkLIor/pg/oBYUx+OmhcwGi6Km4irmUsCD9sS0HAZLQp2JjRikM/nbKkgJRQe3qLXohQ2/aYnpAVFBfsWMhzj2h0IQW+71LLyHzOvQXtKnYhdYs3KyJ83kIWhUM+oDWV7hlC7YZ/HMaSCtIWHEILZtlC/a2Pz5+6G5vwOBW0HaQsMAPDP43xn3+6Hl7bbj4lIrJf2bUy7y+NSTMvu0Zj95++r6brjBXf/SucButnvNVtC+om6pKk6DCfk2CQ6aHtAXRKqWq0iSC3gkrBRs6d4G21qZg8m8Z9TJvLAqKK5nrOd8SlLUbvV5w2CyQghIWz2zo3BtakGDgZ/R6mTcUhQrnMNdzvi0oWbE1o15w6PSQggTzT2RTWxKpIACv0Gs5f58GUlKFk2k1IhuvQ0LJCesxeoU5OfGuKSFFCWYbR2e4BYPfXb8MEgoXXMLgf7+9f8/JAJHSkHDAX3nwe7ftMQiAJrQIAFZQOCCGBAAAUBUAnQEqQABAAD4xFIhDIiEhFQmeiCADBKAMEPtI2HyWCHcLIj8ci9ADpJPJ5ubHRxeqUAH7jw57V/+Ax5fEj20nIyTDv6r6Jegl6n/7HuDfxz+qf8LgGP2Aa6P3v9tykoYmteZpc80RwoLcW8y5LJWewPbKUSwgydEcOce88N0jsG4QwAeRUi4O+fg6s+LxfxHd8X6wjqba4RpiQH4r736DGUPcm2GB96SmHYtvUaCxVgAA/v/+taB/lBTUwUvTGMrY5r3xpMevM7nF4vrqzgM8scaJhKRv6Hy/3qFplQXl7unohFEju2F+40ovv8JGUJ7eMyZsusWC16fVtDAQgfp4SnjnUBLIywWvLcRiAaBnsmwAfjHxAuLBm0tbL9uz2LUz459lFgfoS6f/7k03w5L0P+UZfk6cA8A9AJMIB//uca42f/+osYD6fCbVFey3DTi0UvwqbKP3caDuASQ4ztV3Ncq4qTnijMD+bhyOM7Hrg9AJb2mUtn2eBlnd4IgM9aFIk+ec1vxWEIQ1y7rdCP/M2x/H/OAxLdiabYEOqEugTQ+NcOOxM4dv5fSuvMAN/4feQkbPxFdnk20x3FbOJHylTjxOO5OfG6uT/Y1/9ZswtdRPzj1AD8S+Tbpv3/+jq28RSg8S59u3wtkhHditkJeuaglxzV9GzuqwjbdZN2/MLwm9ez80gHOqwZKtM9b8CWWKAvW1EKg2RcwhHEXBvLfIrtYwtGZjMcrX8f5wxN1dAXwymYDMf70HMMPoD/hcX3pL+/+oRKek1fqckQ8XqpvW11MP1pChfrLITPMpYuffR6gfvbzKfWVjKqnTtGSKppnnLd2R2a+uyEoXX2hvtPTHosjJ58I/jBDUev8i+OWnaVc1XkaDH/P/DuzGs6LHg9jFBtjzv+ZCVTODLrXn1BUdUL4vEIjBDSe3NbV8w6nVlP6c//nuucowWh1odJb5sy6PH//1720oafod8v3aiz5vtrfJ4Bpr9e2+WSoK9NcqXiM/WpWAySLZfLp9xAM3lt1+nvojrm/MPZotQLAJfrQghyfRQgCgYXk5YsCEwDcc52jZuwotjlbMhIefmM1B5HaC/ki5q8yTipAdSNtyW8JB6b5NzTLjPc+F8KofETfP7L3WLrGQ06D8Vckemfxo9rvHvUUl5aPE1GPANBAxYphc1A/myzBHHCruljJwpIWRbLaikLD1sA6/S2u2X4R+Hv/v+ycyr1STuPT9UVupef+OUDvQ4m+Mdtn9FO04SUf4gHDuVqOlwKR8/JHlhrauaCnN4Wmx/5E3uQpQHT/l00L//0HruTO3o9hjPSNDkr7XS+vzaZEsu6x5ZWMAcwgFxSMB1sPX/Rf6HA558Ot1aunMAKraXf/rxWfeddszaXQXrjw//qAp/r/0kk9zaJU8zfGaaVYPWpM02LbYajyxhyeHyui/z9e1qjW8eZLbBwXhtrreUt7KXDI0Mya3UM6DivU6ymzDcCw8H69aab62djsHT1It/uWQ26N4LK07j2vydEt+dNg4NSdwl49++SQj9YijAAAA";

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('This must run unsandboxed...');
    }

    class MarioMakerExtension {
        getInfo(){
            return {
                // ID for the extension + Name + Icons + List of blocks
                id: 'marioapi',
                name: "Super Mario Maker 2",
                menuIconURI: hammerIcon,
                blockIconURI: hammerIcon,
                blocks: [
                    {
                        opcode: "testBlock",
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: true,
                        text: "This is a test block. Remove it with hidefrompalette: true"

                    },
                    {
                        opcode: "fetchUser",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Fetch Maker [MAKERID]",
                        arguments: {
                            MAKERID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "HQ6-63D-94G",
                            }
                        },
                    },
                    {
                        opcode: "fetchUserStatus",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Maker Fetch Status",
                    },
                    {
                        opcode: "UserrequestStatusGood",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "is maker stats fetch successful?",
                    },
                    {
                        opcode: "valuesOfMaker",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Maker's [FORMAT]",
                        arguments: {
                            FORMAT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'MAKER_MENU'
                            }
                        }
                    },
                    {
                        opcode: "MPVSofMaker",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Maker's Multiplayer Versus [RANKINGS]",
                        arguments: {
                            RANKINGS: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'MPVS_MENU'
                            }
                        }
                    }
                ],
                menus: {
                    MAKER_MENU: {
                        acceptReporters: true,
                        items: [
                            "Name", 
                            "Region", 
                            "Country", 
                            "Last Active", 
                            "Courses Played", 
                            "Courses Cleared", 
                            "Courses Attempted", 
                            "Death Count", 
                            "Likes",
                            "Maker Points",
                            "Endless Easy Score",
                            "Endless Normal Score",
                            "Endless Expert Score",
                            "Endless Super Expert Score",
                        ]
                    },
                    MPVS_MENU: {
                        acceptReporters: true,
                        items: [
                            "Rating",
                            "Rank",
                            "Wins", 
                            "Losses",
                            "Plays", 
                            "Disconnections",
                        ]
                    },
                }
            };
        }
        // Below, add the functions for each block that's listed in opcode.
        testBlock() {
            return "Test Value";
        }
    async fetchUser(args) {
        const requestId = ++latestRequestId;
        userInfoResponse = null;
        userStats = null;
        
        const response = await Scratch.fetch(`${baseAPIURL}user_info/${args.MAKERID}`);
        if (requestId !== latestRequestId) return; // Superseded by a newer request
        
        if (!response.ok) {
            userInfoResponse = response.status;
            throw new Error(`Failed to fetch maker data (status ${response.status})`);
        }
        userInfoResponse = response.status;
        const data = await response.json();
        if (requestId !== latestRequestId) return;
        userStats = data;
        return "Good.";
    }
        fetchUserStatus() {
            if (userInfoResponse == null){
                return "Do a request to the API to see this update!"
            }
            return userInfoResponse;
        }
        UserrequestStatusGood() {
            if (userInfoResponse == 200){
                return true;
            } else {
                return false;
            }
        }
        valuesOfMaker(args) {
            if (userInfoResponse == null){
                return "Do a request to the API to see this update!"
            }

            switch(args.FORMAT.toLowerCase()){
                case "name":
                    return userStats["name"];
                case "region":
                    return userStats["region_name"];
                case "country":
                    return userStats["country"];
                case "last active":
                    return userStats["last_active_pretty"];
                case "courses played":
                    return userStats["courses_played"];
                case "courses cleared":
                    return userStats["courses_cleared"];
                case "courses attempted":
                    return userStats["courses_attempted"];
                case "death count":
                    return userStats["courses_deaths"];
                case "likes":
                    return userStats["likes"];
                case "endless easy score":
                    return userStats["easy_highscore"];
                case "endless normal score":
                    return userStats["normal_highscore"];
                case "endless expert score":
                    return userStats["expert_highscore"];
                case "endless super expert score":
                    return userStats["super_expert_highscore"];
                case "maker points":
                    return userStats["maker_points"];
                    
            }
        }
        MPVSofMaker(args) {
            if (userInfoResponse == null){
                return "Do a request to the API to see this update!"
            }
            switch (args.RANKINGS.toLowerCase()){
                case "rating":
                    return userStats["versus_rating"]
                case "disconnections":
                    return userStats["versus_disconnected"]
                case "rank":
                    return userStats["versus_rank_name"]
                case "wins":
                    return userStats["versus_won"]
                case "losses":
                    return userStats["versus_lost"]
                case "plays":
                    return userStats["versus_plays"]
            }
        }

    }

    Scratch.extensions.register(new MarioMakerExtension());
// @ts-ignore
})(Scratch);
