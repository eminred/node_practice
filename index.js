const yargs = require ("yargs")
const path = require("path")
const util = require ("util")
const fs = require("fs")

const args = yargs 
    .usage('Usage: nade $0 [options]')
    .help('help')
    .alias('help', 'h')
    .version('0.0.1')
    .alias('version', 'v')
    .example('node $0 --entry ./path/ --dist ../path/ --delete')
    .option('entry', {
        alias: 'e',
        describe: 'Указать путь к исходной директории',
        demandOption: true
    })
    .option('dist', {
        alias: 'd',
        describe: 'Путь, куда выложить файл после сортировки',
        default: './dist'
    })
    .option('delete', {
        alias: 'D',
        describe: "Удалить ли исходную директорию",
        boolean: true,
        default: false
    })
    .epilog('Моя первая домашка')
    .argv

    //console.log(args)

const config = { 
    src: path.join(__dirname, args.entry),
    dist: path.join(__dirname, args.dist),
    delete: args.delete
}

//console.log(config)

function sorter(src) {
    const files = fs.readdir(src, (err, files) => {
        if(err) throw err

        files.forEach((file)=> {
            const currentPath = path.join(src, file)
            
            fs.stat(currentPath, (err, stats)=> {
                if (err) throw err 

                if (stats.isDirectory()) {
                    sorter(currentPath)
                } else {
                    //console.log('copy', currentPath)

                    const { src: targetDir = "other" } = config.typeDirs.find(dir => dir.type == currentPath) || {}

                    const oldPath = path.join(__dirname, src, file)
                    const newPath = path.join(__dirname, src, targetDir, file)
                    
                    fs.rename(oldPath, newPath, function (err) {
                        if(err){
                            throw err
                        }
                    })
                }
            })
        })
    })
}

try {
    sorter(config.src)
} catch (error) {
    console.log(err)
}











