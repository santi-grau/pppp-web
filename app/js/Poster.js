
import TextToSVG from 'text-to-svg'
import helvetica from './../assets/fonts/dmserif.ttf'
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
            
            if( data.foreground == '#ffffff' ) p.parentNode.classList.add( 'white' )
            else p.parentNode.classList.remove( 'white' )
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

        var signaturePath = 'M383.8,7.1c-2.7,0-4.3,1.4-5.1,3.6V7.4h-5.3v17.9h5.4v-8.3c0-3.4,1.7-4.9,4.8-4.9h1.4V7.1C384.6,7.1,384.2,7.1,383.8,7.1 M361.5,10.9c2.2,0,3.6,1.3,4,3.5h-7.9C358,12,359.6,10.9,361.5,10.9 M370.8,16.8c0-6-3.6-9.9-9.2-9.9s-9.2,3.7-9.2,9.4c0,5.7,3.8,9.4,9.3,9.4c4.3,0,7.8-2.2,8.8-6h-5.1c-0.6,1.3-1.8,2-3.6,2c-2.1,0-3.7-1.2-4.1-3.8h13.3L370.8,16.8L370.8,16.8z M351.2,11.3v-4h-3.4V2h-5.4v5.3h-2.7v4h2.7v9c0,3.7,1.9,5.1,6.4,5.1c0.8,0,1.7,0,2.5-0.1v-4h-1.4c-1.4,0-2-0.2-2-1.6v-8.4C347.7,11.3,351.2,11.3,351.2,11.3z M330.5,25.8c5.4,0,8.5-2.1,8.5-5.8c0-3.2-2-4.9-6.3-5.6l-2.7-0.4c-1.7-0.3-2.6-0.7-2.6-1.8c0-1,0.8-1.7,2.7-1.7s3.2,0.6,3.3,2.5h5c-0.2-3.5-2.3-6.1-8.3-6.1c-5.2,0-8,2.1-8,5.7c0,3.2,2.3,4.9,6,5.5l2.3,0.4c2.4,0.4,3.1,0.9,3.1,2s-0.8,1.7-3,1.7c-2.3,0-3.2-0.7-3.4-2.6h-5.3C322.2,24,325,25.8,330.5,25.8 M311.3,21.3c-2.4,0-3.9-1.6-3.9-5s1.5-5,3.9-5c2.4,0,3.9,1.6,3.9,5S313.7,21.3,311.3,21.3 M311.3,25.7c5.7,0,9.4-3.7,9.4-9.4s-3.7-9.4-9.4-9.4c-5.7,0-9.4,3.7-9.4,9.4S305.6,25.7,311.3,25.7 M290.9,21.3c-2.4,0-3.9-1.6-3.9-5s1.4-5,3.9-5c2.4,0,3.8,1.5,3.8,4.9S293.3,21.3,290.9,21.3 M292.4,6.9c-2.5,0-4.3,1.1-5.4,2.8V7.3h-5.3v24.7h5.4v-9c1.1,1.6,2.9,2.6,5.3,2.6c4.9,0,7.8-3.7,7.8-9.4S297.3,6.9,292.4,6.9 M263.1,31.2h17.1v-4h-17.1V31.2z M262.4,11.3v-4H259V2h-5.4v5.3h-2.7v4h2.7v9c0,3.7,1.9,5.1,6.3,5.1c0.8,0,1.7,0,2.5-0.1v-4H261c-1.4,0-2-0.2-2-1.6v-8.4C258.9,11.3,262.4,11.3,262.4,11.3z M241.7,25.8c5.4,0,8.5-2.1,8.5-5.8c0-3.2-2.1-4.9-6.3-5.6l-2.7-0.4c-1.7-0.3-2.6-0.7-2.6-1.8c0-1,0.8-1.7,2.7-1.7s3.2,0.6,3.3,2.5h5c-0.2-3.5-2.3-6.1-8.3-6.1c-5.2,0-8.1,2.1-8.1,5.7c0,3.2,2.3,4.9,6,5.5l2.3,0.4c2.4,0.4,3.1,0.9,3.1,2s-0.8,1.7-3,1.7c-2.3,0-3.2-0.7-3.4-2.6h-5.3C233.4,24,236.3,25.8,241.7,25.8 M222.3,10.9c2.2,0,3.6,1.3,4,3.5h-7.9C218.8,12,220.3,10.9,222.3,10.9 M231.6,16.8c0-6-3.6-9.9-9.2-9.9s-9.2,3.7-9.2,9.4c0,5.7,3.8,9.4,9.3,9.4c4.3,0,7.8-2.2,8.8-6h-5.1c-0.6,1.3-1.8,2-3.6,2c-2.1,0-3.7-1.2-4.1-3.8h13.3V16.8z M211.9,11.3v-4h-3.4V2h-5.4v5.3h-2.7v4h2.7v9c0,3.7,1.9,5.1,6.3,5.1c0.8,0,1.7,0,2.5-0.1v-4h-1.4c-1.4,0-2.1-0.2-2.1-1.6v-8.4C208.5,11.3,211.9,11.3,211.9,11.3z M190.6,21.3c-2.4,0-3.9-1.6-3.9-5s1.5-5,3.9-5c2.4,0,3.9,1.6,3.9,5S193,21.3,190.6,21.3 M190.6,25.7c5.7,0,9.4-3.7,9.4-9.4s-3.7-9.4-9.4-9.4c-5.7,0-9.4,3.7-9.4,9.4S184.9,25.7,190.6,25.7 M179.2,7.1c-2.7,0-4.3,1.4-5.1,3.6V7.4h-5.3v17.9h5.4v-8.3c0-3.4,1.7-4.9,4.8-4.9h1.4V7.1C180,7.1,179.6,7.1,179.2,7.1 M157.1,21.3c-2.4,0-3.9-1.6-3.9-5s1.4-5,3.9-5c2.4,0,3.8,1.5,3.8,4.9S159.5,21.3,157.1,21.3 M158.6,6.9c-2.5,0-4.3,1.1-5.4,2.8V7.3h-5.3v24.7h5.4v-9c1.1,1.6,2.9,2.6,5.3,2.6c4.9,0,7.8-3.7,7.8-9.4S163.5,6.9,158.6,6.9 M129.3,31.2h17.1v-4h-17.1V31.2z M120,25.7c5,0,8.5-2.9,8.8-7.5h-5.4c-0.2,2.1-1.7,3-3.5,3c-2.3,0-3.7-1.5-3.7-4.9s1.4-5,3.7-5c1.7,0,3.1,0.8,3.4,2.7h5.4c-0.5-4.4-3.8-7.1-8.8-7.1c-5.6,0-9.2,3.7-9.2,9.4S114.4,25.7,120,25.7 M103,25.3h5.4V7.4H103V25.3z M103.1,5.3h5.2V0.7h-5.2V5.3z M94.4,25.3h5.4V0.6h-5.4V25.3z M82.7,21.3c-2.4,0-3.8-1.6-3.8-5s1.4-5,3.8-5c2.4,0,3.8,1.5,3.8,4.9S85.1,21.3,82.7,21.3 M84.2,6.9c-2.4,0-4.1,1-5.3,2.6v-9h-5.4v24.7h5.3v-2.4c1.2,1.7,2.9,2.8,5.4,2.8c4.9,0,7.8-3.7,7.8-9.4S89,6.9,84.2,6.9 M64.9,7.4v10c0,2.6-1.7,3.7-3.4,3.7c-2,0-2.9-1.1-2.9-3.1V7.4h-5.4v11.7c0,4.4,2.7,6.6,6.2,6.6c2.6,0,4.4-1.3,5.6-3v2.5h5.3V7.4H64.9z M41.9,21.3c-2.4,0-3.8-1.6-3.8-5s1.4-5,3.8-5c2.4,0,3.8,1.5,3.8,4.9S44.3,21.3,41.9,21.3 M43.4,6.9c-2.5,0-4.3,1.1-5.4,2.8V7.3h-5.3v24.7h5.4v-9c1.2,1.6,2.8,2.6,5.3,2.6c4.9,0,7.8-3.7,7.8-9.4S48.3,6.9,43.4,6.9 M15,18.6c-1.9,0-2.8-1.3-2.8-4c0-2.5,0.8-3.9,2.8-3.9c1.9,0,2.7,1.4,2.7,3.9C17.7,17.3,16.9,18.6,15,18.6 M15.2,0C5.9,0,0,6.4,0,14.7c0,8.9,6.1,14.7,15.4,14.7c2.5,0,5-0.4,7.2-1.2v-3.5c-2.1,0.9-4.6,1.3-7.2,1.3c-6.8,0-11.5-4.1-11.5-11.4C3.9,8,8.3,3.5,15.1,3.5c7.3,0,11.3,4.1,11.3,9.9c0,2.8-0.8,5.2-2.6,5.2c-1,0-1.5-0.6-1.5-2V7.4h-4.7v1.7c-0.9-1.5-2.2-2.2-4.1-2.2c-3.3,0-6.2,2.7-6.2,7.7c0,5.3,2.7,7.8,6.1,7.8c2,0,3.8-0.9,4.8-2.9c0.6,1.9,2.4,3,4.9,3c4.5,0,7.1-4,7.1-9.3C30.3,5.5,24.2,0,15.2,0'
        var signature = document.createElementNS( svgns, 'path' )
        signature.setAttributeNS( null, 'd', signaturePath )
        signature.setAttributeNS( null, 'fill', style.color )

        var px = ( textarea.parentNode.getBoundingClientRect().width - ( textarea.parentNode.getBoundingClientRect().width / 385 ) * 0.7 ) / 2 - ( 385 * 0.33 )
        signature.setAttributeNS( null, 'transform', 'translate( ' + px + ', ' + ( textarea.parentNode.getBoundingClientRect().height - 32 * 0.7 - 10 ) + ') scale( ' + ( textarea.parentNode.getBoundingClientRect().width / 385 ) * 0.7 + ')' )
        vector.appendChild( signature )
        
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