import { svgAsPngUri } from 'save-svg-as-png'

class DownloadManager{
    constructor(){
        
    }

    downloadPDF( svg ){
        
        svg.querySelector( 'rect' ).setAttribute( 'fill', 'rgb( 2555, 255, 255 )' )
        alert('here')
        Object.values( svg.querySelectorAll( 'path' ) ).forEach( l => {
            l.setAttribute( 'fill', 'rgb( 0, 0, 0 )' )
        })
        var win = window.open();
        svgAsPngUri( svg, { scale: 2 } ).then( uri => {
            
            svgAsPngUri( svg, { scale: 2 } ).then( uri => {
                win.location = uri
            } )

        } )
     
    }

    downloadPNG( svg ){
        var win = window.open();
        svgAsPngUri( svg, { scale: 2 } ).then( uri => {
            win.location = uri
        } )
    }
}

export { DownloadManager as default }