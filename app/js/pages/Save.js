import Page from './../Page'
import { saveSvgAsPng, svgAsPngUri } from 'save-svg-as-png'

class Save extends Page{
    constructor( p ){
        super( p )

    }

    onEnterPage(){
        // if( !window.posterUploaded ) this.emit( 'updateFlow' , { action : 'posterExport', data : 'svg' } )
        window.posterUploaded = true
        var vector = document.getElementsByTagName( 'svg' )[ 0 ]
        svgAsPngUri( vector, { scale: 2 } ).then( uri => {
            this.node.querySelector( '.save[data-format=png]' ).href = uri
        } )
    }
}

export { Save as default }