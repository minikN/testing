import readline from 'readline'
// import process from 'node:process'
import getCursorPos from 'get-cursor-position'
import {execa} from 'execa';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// const print = maxLines => {
//     let currentLine = 0
//     const rl = readline.createInterface({input, output})
    
//     return (s) => {
//         const shouldReset = currentLine === maxLines - 1
//         const currentCursorPosition = getCursorPos.sync()

//         process.stdout.write(`${s}${!shouldReset ? '\n' : ''}`)
//         readline.cursorTo(output, 0, shouldReset ? currentCursorPosition.row - maxLines : undefined)

//         currentLine = !shouldReset ? currentLine + 1 : 0
//     }
// }

// for await (const line of $`sudo -S pacman --color auto --noconfirm --noprogressbar -S acme`) {
//     five(line)
// }

const printCommandOutputWithLines = (maxLines) => {
    let currentLine = 0

    return async (callback, options = {}) => {
        const {header, footer} = options
        
        // Setting cursor to the bottom of the window
        readline.cursorTo(process.stdout, 0, process.stdout.rows)
        
        header && console.log(header)

        for await (const line of callback()) {
            await sleep(500)
            const shouldReset = currentLine === maxLines - 1

            process.stdout.write(`${line}${!shouldReset ? '\n' : ''}`)
            readline.cursorTo(process.stdout, 0, shouldReset ? process.stdout.rows - maxLines : undefined)

            currentLine = !shouldReset ? currentLine + 1 : 0
        }

        readline.cursorTo(process.stdout, 0, process.stdout.rows)
        footer && console.log(`\n${footer}`)
    }
}

const five = printCommandOutputWithLines(5)

await five(
    () => execa`sudo -S pacman --color always --noconfirm --noprogressbar -S acme`,
    {header: 'Doing stuff...', footer: 'Done doing stuff.'}
)