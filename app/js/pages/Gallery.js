import Page from './../Page'
import { saveSvgAsPng, svgAsPngUri } from 'save-svg-as-png'
import DownloadManager from './../DownloadManager'

class Gallery extends Page{
    constructor( p ){
        super( p )

        var api = 'AIzaSyBaLx1pf7T2E0ANuktHCAXDu9bfIpGU4X8'
        var api_key = 'AIzaSyC8y5mzWn4GeKgezS4_s1j0OZ4wg5cATVY';
        var folderId = '1AXV4s0qcnwPydKjFNb1id5YmQvifmuMx';
        var url = "https://www.googleapis.com/drive/v2/files?q='" + folderId + "'+in+parents&key=" + api_key + "&orderBy=modifiedDate desc";
        this.downloadManager = new DownloadManager()
        fetch(url).then(function(response) { return response.json(); }).then( (myJson) => {
            console.log(myJson);
            myJson.items.forEach( f => {
                if( f.mimeType == 'image/svg+xml' ) {
                    this.addItem( f )
                    // console.log( f.downloadUrl  , f.thumbnailLink   )
                }
            })
        });
    }

    addItem( f ){

        var list = this.node.querySelector( 'ul' )

        var listItem = document.createElement( 'li' )
        listItem.classList.add( 'block', 'clearfix' )

        var topContainer = document.createElement( 'div' )
        topContainer.classList.add( 'title', 'clearfix' )
        listItem.appendChild( topContainer )

        var date = document.createElement( 'span' )
        date.classList.add( 'date' )
        var d = new Date( f.createdDate )
        date.innerHTML = d.getDate().toString().padStart( 2, "0" ) + '.' + ( d.getMonth() + 1 ).toString().padStart( 2, "0" ) + '.' + ( d.getFullYear().toString().substring(2, 4) )
        topContainer.appendChild( date )
        
        var util = document.createElement( 'span' )
        util.classList.add( 'util' )
        topContainer.appendChild( util )
        util.innerHTML = ' '

        

        var imgCont = document.createElement( 'div' )
        imgCont.classList.add( 'imgCont' )
        listItem.appendChild( imgCont )
        imgCont.style.backgroundImage = 'url( "https://drive.google.com/uc?id=' + f.id + '" )'

        list.appendChild( listItem )
        
    }

    openPDF( l ){
        fetch( 'https://cors-anywhere.herokuapp.com/' + l ).then( response => response.text() ).then( svg => {
            this.downloadManager.downloadPDF( document.getElementsByTagName( 'svg' )[ 0 ] )
        })
    }

    openPNG( l ){
        fetch( 'https://cors-anywhere.herokuapp.com/' + l ).then( response => response.text() ).then( svg => {
            this.downloadManager.downloadPNG( document.getElementsByTagName( 'svg' )[ 0 ] )
        })
    }
}

export { Gallery as default }