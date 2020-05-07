
import TextToSVG from 'text-to-svg'
import helvetica from './../assets/fonts/HelveticaNowTextBold.otf'
import geogrotesque from './../assets/fonts/geogrotesque.otf'
import marsh from './../assets/fonts/marsh.otf'
import cooper from './../assets/fonts/cooper.otf'
import dmserif from './../assets/fonts/dmserif.ttf'
import archicoco from './../assets/fonts/archicoco.otf'
import kmstandard from './../assets/fonts/kmstandard.otf'
import trim from './../assets/fonts/trim.otf'
import funct from './../assets/fonts/funct.otf'


import { saveSvgAsPng, svgAsPngUri } from 'save-svg-as-png'
import jsPDF from 'jspdf'

var fonts = { 
    helvetica : helvetica, 
    geogrotesque : geogrotesque, 
    marsh : marsh, 
    trim : trim,
    cooper : cooper,
    dmserif : dmserif,
    archicoco : archicoco,
    kmstandard : kmstandard,
    funct : funct
}

class Poster{
    constructor(){
        this.size = 46
        this.space = -1.5
        this.height = 50
    }

    updateCopy( copy ){
        Object.values( document.querySelectorAll( '.poster.editor' ) ).forEach( p => { p.value = copy } )
        this.posterExport( null )
    }

    updateSize( size ){
        Object.values( document.querySelectorAll( '.poster' ) ).forEach( p => { 
            p.style[ 'font-size' ] = 46 * size + 'px'
            p.style[ 'letter-spacing' ] = -1.5 * size + 'px'
            p.style[ 'line-height' ] = 50 * size + 'px'
        } )
        // this.posterExport( null )
    }

    updateFont( font ){
        Object.values( document.querySelectorAll( '.poster' ) ).forEach( p => { p.dataset.font = font } )
        // this.posterExport( null )
    }

    updateAlign( dir ){
        Object.values( document.querySelectorAll( '.poster' ) ).forEach( p => { p.style. textAlign = dir; console.log( p ) } )
        // this.posterExport( null )
    }

    updateColor( data ){
        Object.values( document.querySelectorAll( '.poster' ) ).forEach( p => {
            p.parentNode.style.backgroundColor = data.background
            p.style.color = data.foreground
        })
        // this.posterExport( null )
    }

    posterExport( format, meta = null ){
    
        var textarea = document.querySelectorAll( '.poster' )[ 0 ]
        
        var composerText = document.getElementById( 'composerText' )
        composerText.style.width =  textarea.parentNode.getBoundingClientRect().width + 'px'
        composerText.style.height = textarea.parentNode.getBoundingClientRect().height + 'px'

        var inner = document.getElementById( 'composerInner' )
        inner.style.width =  textarea.getBoundingClientRect().width + 'px'
        inner.style.height = textarea.getBoundingClientRect().height + 'px'

        var svgns = 'http://www.w3.org/2000/svg'
        var vector = document.getElementsByTagName( 'svg' )[ 0 ]
        vector.setAttribute( 'width',  textarea.parentNode.getBoundingClientRect().width )
        vector.setAttribute( 'height', textarea.parentNode.getBoundingClientRect().height )


        
        const style = getComputedStyle( textarea )
        while (vector.lastChild) vector.removeChild( vector.lastChild )
        // console.log( style, style.backgroundColor )
        
        var rect = document.createElementNS( svgns, 'rect' );
        rect.setAttributeNS( null, 'width', textarea.parentNode.getBoundingClientRect().width )
        rect.setAttributeNS( null, 'height', textarea.parentNode.getBoundingClientRect().height )
        rect.setAttributeNS( null, 'fill', getComputedStyle( textarea.parentNode ).backgroundColor )
        vector.appendChild( rect )
        
        inner.style[ 'font-size' ] = textarea.style[ 'font-size' ]
        inner.dataset.font = textarea.dataset.font
        inner.style[ 'letter-spacing' ] = textarea.style[ 'letter-spacing' ]
        inner.style[ 'line-height' ] = textarea.style[ 'line-height' ]
        inner.style[ 'text-align' ] = textarea.style[ 'text-align' ]
        // console.log( slugify( textarea.value ) )
        document.body.appendChild( composerText )

        var content = textarea.value.split('')
        inner.innerHTML = ''
        
        content.forEach( g => {
            var skipGlyph = false
            var s = document.createElement( 'span' )
            s.innerHTML = g
            inner.appendChild( s )
            if( g.indexOf('\n') >= 0 ){
                s.innerHTML = '<br/>'
                skipGlyph = true
            }

            if( g.indexOf(' ') >= 0 ){
                s.innerHTML = ' '
                skipGlyph = true
            }

            if( !skipGlyph ){
                TextToSVG.load( fonts[ textarea.dataset.font ], ( err, textToSVG ) => {
                    const attributes = { fill: style.color }
                    const options = { 
                        x : s.offsetLeft + 5, 
                        y : s.offsetTop + 5, 
                        fontSize: parseInt( style.fontSize ), 
                        attributes: attributes,
                        anchor : 'left top'
                    }

                    var path = new DOMParser().parseFromString( textToSVG.getSVG( g, options ), 'image/svg+xml').querySelector( 'path' )
                    vector.appendChild( path )
                })
            }
        })

        // var signaturePath = 'M383.76,7.08c-2.67,0-4.34,1.39-5.1,3.61V7.36h-5.28v17.91h5.42v-8.33c0-3.37,1.74-4.86,4.76-4.86h1.39V7.15C384.56,7.12,384.18,7.08,383.76,7.08 M361.55,10.94c2.19,0,3.61,1.32,3.99,3.54h-7.91C358.04,11.98,359.57,10.94,361.55,10.94 M370.85,16.84c0-6.04-3.64-9.89-9.23-9.89c-5.59,0-9.23,3.71-9.23,9.37c0,5.69,3.75,9.37,9.3,9.37c4.3,0,7.78-2.22,8.75-6.01h-5.14c-0.62,1.28-1.8,2.01-3.61,2.01c-2.12,0-3.71-1.21-4.1-3.78h13.26V16.84z M351.17,11.32V7.36h-3.44V2.05h-5.41v5.31h-2.67v3.96h2.67v8.96c0,3.68,1.88,5.14,6.35,5.14c0.8,0,1.67-0.03,2.5-0.14v-4.03h-1.39c-1.39,0-2.05-0.24-2.05-1.56v-8.37H351.17z M330.51,25.79c5.38,0,8.54-2.08,8.54-5.8c0-3.19-2.05-4.89-6.28-5.55l-2.67-0.38c-1.74-0.28-2.6-0.73-2.6-1.81c0-1.04,0.8-1.7,2.74-1.7c1.94,0,3.23,0.59,3.3,2.53h5.03c-0.17-3.51-2.29-6.14-8.33-6.14c-5.24,0-8.05,2.08-8.05,5.66c0,3.19,2.26,4.9,6.04,5.49l2.33,0.38c2.43,0.38,3.09,0.9,3.09,1.98s-0.83,1.73-3.02,1.73c-2.26,0-3.23-0.66-3.44-2.6h-5.28C322.22,24.02,325.03,25.79,330.51,25.79 M311.32,21.35c-2.43,0-3.92-1.63-3.92-5.03s1.49-5.03,3.92-5.03c2.4,0,3.89,1.63,3.89,5.03S313.71,21.35,311.32,21.35 M311.32,25.69c5.69,0,9.37-3.68,9.37-9.37s-3.68-9.37-9.37-9.37c-5.73,0-9.41,3.68-9.41,9.37S305.59,25.69,311.32,25.69 M290.94,21.35c-2.43,0-3.85-1.63-3.85-5.03s1.42-5.03,3.85-5.03c2.4,0,3.82,1.49,3.82,4.9S293.33,21.35,290.94,21.35 M292.43,6.94c-2.53,0-4.27,1.08-5.41,2.81v-2.4h-5.28v24.72h5.42v-8.99c1.15,1.63,2.85,2.6,5.28,2.6c4.86,0,7.81-3.68,7.81-9.37S297.29,6.94,292.43,6.94 M263.1,31.17h17.11v-3.96H263.1V31.17z M262.4,11.32V7.36h-3.44V2.05h-5.42v5.31h-2.67v3.96h2.67v8.96c0,3.68,1.88,5.14,6.35,5.14c0.8,0,1.67-0.03,2.5-0.14v-4.03h-1.39c-1.39,0-2.05-0.24-2.05-1.56v-8.37H262.4z M241.75,25.79c5.38,0,8.54-2.08,8.54-5.8c0-3.19-2.05-4.89-6.28-5.55l-2.67-0.38c-1.74-0.28-2.6-0.73-2.6-1.81c0-1.04,0.8-1.7,2.74-1.7s3.23,0.59,3.3,2.53h5.03c-0.17-3.51-2.29-6.14-8.33-6.14c-5.24,0-8.05,2.08-8.05,5.66c0,3.19,2.26,4.9,6.04,5.49l2.33,0.38c2.43,0.38,3.09,0.9,3.09,1.98s-0.83,1.73-3.02,1.73c-2.26,0-3.23-0.66-3.44-2.6h-5.28C233.45,24.02,236.26,25.79,241.75,25.79 M222.31,10.94c2.19,0,3.61,1.32,3.99,3.54h-7.91C218.8,11.98,220.33,10.94,222.31,10.94 M231.61,16.84c0-6.04-3.64-9.89-9.23-9.89c-5.59,0-9.23,3.71-9.23,9.37c0,5.69,3.75,9.37,9.3,9.37c4.31,0,7.78-2.22,8.75-6.01h-5.14c-0.62,1.28-1.8,2.01-3.61,2.01c-2.12,0-3.71-1.21-4.1-3.78h13.26V16.84z M211.93,11.32V7.36h-3.44V2.05h-5.42v5.31h-2.67v3.96h2.67v8.96c0,3.68,1.87,5.14,6.35,5.14c0.8,0,1.67-0.03,2.5-0.14v-4.03h-1.39c-1.39,0-2.05-0.24-2.05-1.56v-8.37H211.93z M190.62,21.35c-2.43,0-3.92-1.63-3.92-5.03s1.49-5.03,3.92-5.03c2.4,0,3.89,1.63,3.89,5.03S193.01,21.35,190.62,21.35 M190.62,25.69c5.69,0,9.37-3.68,9.37-9.37s-3.68-9.37-9.37-9.37c-5.73,0-9.41,3.68-9.41,9.37S184.89,25.69,190.62,25.69 M179.23,7.08c-2.67,0-4.34,1.39-5.1,3.61V7.36h-5.28v17.91h5.42v-8.33c0-3.37,1.74-4.86,4.76-4.86h1.39V7.15C180.03,7.12,179.65,7.08,179.23,7.08 M157.15,21.35c-2.43,0-3.85-1.63-3.85-5.03s1.42-5.03,3.85-5.03c2.4,0,3.82,1.49,3.82,4.9S159.55,21.35,157.15,21.35 M158.64,6.94c-2.53,0-4.27,1.08-5.42,2.81v-2.4h-5.28v24.72h5.41v-8.99c1.15,1.63,2.85,2.6,5.28,2.6c4.86,0,7.81-3.68,7.81-9.37S163.5,6.94,158.64,6.94 M129.31,31.17h17.11v-3.96h-17.11V31.17z M120.01,25.69c4.96,0,8.47-2.85,8.85-7.46h-5.38c-0.24,2.12-1.67,3.02-3.47,3.02c-2.26,0-3.71-1.49-3.71-4.93c0-3.44,1.42-4.96,3.71-4.96c1.74,0,3.05,0.83,3.37,2.74h5.38c-0.49-4.41-3.82-7.15-8.75-7.15c-5.62,0-9.2,3.68-9.2,9.37S114.42,25.69,120.01,25.69 M102.96,25.27h5.42V7.36h-5.42V25.27z M103.1,5.31h5.17V0.73h-5.17V5.31z M94.39,25.27h5.42V0.56h-5.42V25.27z M82.69,21.35c-2.43,0-3.85-1.63-3.85-5.03s1.42-5.03,3.85-5.03c2.4,0,3.82,1.49,3.82,4.9S85.09,21.35,82.69,21.35 M84.18,6.94c-2.43,0-4.13,0.97-5.28,2.6V0.56h-5.42v24.72h5.28v-2.39c1.15,1.73,2.88,2.81,5.42,2.81c4.86,0,7.81-3.68,7.81-9.37S89.04,6.94,84.18,6.94 M64.95,7.36v10c0,2.64-1.74,3.72-3.4,3.72c-2.01,0-2.88-1.08-2.88-3.06V7.36h-5.42v11.73c0,4.44,2.67,6.6,6.21,6.6c2.64,0,4.44-1.28,5.62-2.95v2.53h5.28V7.36H64.95z M41.93,21.35c-2.43,0-3.85-1.63-3.85-5.03s1.42-5.03,3.85-5.03c2.4,0,3.82,1.49,3.82,4.9S44.33,21.35,41.93,21.35 M43.43,6.94c-2.53,0-4.27,1.08-5.42,2.81v-2.4h-5.28v24.72h5.42v-8.99c1.15,1.63,2.85,2.6,5.28,2.6c4.86,0,7.81-3.68,7.81-9.37S48.29,6.94,43.43,6.94 M14.96,18.61c-1.94,0-2.81-1.32-2.81-3.96c0-2.46,0.8-3.89,2.78-3.89c1.94,0,2.74,1.42,2.74,3.89C17.67,17.29,16.87,18.61,14.96,18.61 M15.24,0C5.9,0,0,6.39,0,14.68c0,8.89,6.07,14.75,15.41,14.75c2.5,0,4.96-0.35,7.22-1.22v-3.47c-2.15,0.9-4.58,1.32-7.19,1.32c-6.8,0-11.52-4.13-11.52-11.39c0-6.63,4.34-11.14,11.21-11.14c7.32,0,11.28,4.06,11.28,9.86c0,2.81-0.76,5.17-2.57,5.17c-0.97,0-1.49-0.62-1.49-2.01v-9.2H17.6V9.1c-0.94-1.49-2.22-2.15-4.06-2.15c-3.33,0-6.18,2.67-6.18,7.71c0,5.31,2.74,7.78,6.14,7.78c1.98,0,3.82-0.87,4.83-2.88c0.59,1.88,2.36,3.02,4.86,3.02c4.55,0,7.15-3.96,7.15-9.3C30.34,5.52,24.16,0,15.24,0'
        // var signature = document.createElementNS( svgns, 'path' )
        // signature.setAttributeNS( null, 'd', signaturePath )
        // signature.setAttributeNS( null, 'fill', 'rgb(0,0,0)' )
        // signature.setAttributeNS( null, 'transform', 'translate( 0, ' + ( textarea.parentNode.getBoundingClientRect().height - 20 ) + ') scale( 0.3)' )
        // vector.appendChild( signature )
        
        var title = this.slugify( textarea.value )

        if( format ){
            setTimeout( () => {
                if( format == 'png' ) this.downloadPNG( vector, title )
                if( format == 'pdf' ) this.downloadPDF( vector, title )
                if( format == 'svg' ) this.downloadSVG( vector, title, meta )
            }, 1000 )
        }

        
        
    }

    slugify( string ) {
        const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;', b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------',p = new RegExp(a.split('').join('|'), 'g')
        return string.toString().toLowerCase().replace(/\s+/g, '-').replace(p, c => b.charAt(a.indexOf(c))).replace(/&/g, '-and-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '')
    }

    downloadPDF( svg, title ){
        var pdf = new jsPDF({ orientation : 'portrait', unit : 'mm', format : 'a3' } )
        
        svg.querySelector( 'rect' ).setAttribute( 'fill', 'rgb( 2555, 255, 255 )' )

        Object.values( svg.querySelectorAll( 'path' ) ).forEach( l => {
            console.log( l.setAttribute( 'fill', 'rgb( 0, 0, 0 )' ) ) 
        })
        
        svgAsPngUri( svg, { scale: 2 } ).then( uri => {
            pdf.addImage( uri, 'png', 0, 0, 297, 420, 'alias', 'NONE', 0 )
            pdf.save( title + '.pdf');
        } )
    }

    downloadSVG( svg, title, meta ){
        fetch('https://cors-anywhere.herokuapp.com/https://radiant-springs-85452.herokuapp.com/api',{ 
        // fetch('http://localhost:5000/api',{ 
            method: 'post', 
            body: JSON.stringify( { 
                data : new XMLSerializer().serializeToString( svg ),
                title : title,
                description : meta || ''
            } ),
            headers: {'Content-Type': 'application/json'}
            
        } ).then( (response) => { 
            if( response.status == 200 ) return response.json()
        } )
        .then( ( myJson ) => {
            window.posterId = myJson.file
        })
    }

    downloadPNG( svg, title ){
        saveSvgAsPng( svg, title + '.png', { scale: 0.5 } )
    }
}


export { Poster as default }