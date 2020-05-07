import Page from './../Page'

class Gallery extends Page{
    constructor( p ){
        super( p )

        var api = 'AIzaSyBaLx1pf7T2E0ANuktHCAXDu9bfIpGU4X8'
        var api_key = 'AIzaSyC8y5mzWn4GeKgezS4_s1j0OZ4wg5cATVY';
        var folderId = '1AXV4s0qcnwPydKjFNb1id5YmQvifmuMx';
        var url = "https://www.googleapis.com/drive/v3/files?q='" + folderId + "'+in+parents&key=" + api_key;

        fetch(url).then(function(response) { return response.json(); }).then( (myJson) => {
            console.log(myJson);
            myJson.files.forEach( f => {
                if( f.mimeType == 'image/svg+xml' ) {
                    this.addItem( f )
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
        date.innerHTML = '01.01.20'
        topContainer.appendChild( date )
        
        var util = document.createElement( 'span' )
        util.classList.add( 'util' )
        topContainer.appendChild( util )
        util.innerHTML = 'Descarga '

        var linkjpg = document.createElement( 'a' )
        linkjpg.setAttribute( 'href', 'javascript : void( 0 );')
        linkjpg.innerHTML = 'JPG '
        util.appendChild( linkjpg )

        var linkpdf = document.createElement( 'a' )
        linkpdf.setAttribute( 'href', 'javascript : void( 0 );')
        linkpdf.innerHTML = 'PDF '
        util.appendChild( linkpdf )

        var imgCont = document.createElement( 'div' )
        imgCont.classList.add( 'imgCont' )
        listItem.appendChild( imgCont )

        var img = document.createElement( 'img' )
        img.setAttribute( 'src', 'https://drive.google.com/uc?id=' + f.id )
        img.setAttribute( 'width', '100%' )
        img.setAttribute( 'height', 'auto' )

        imgCont.appendChild( img )

        list.appendChild( listItem )
        
    }
}

export { Gallery as default }