import Page from './../Page'
import DownloadManager from './../DownloadManager'

class Save extends Page{
    constructor( p ){
        super( p )
        this.downloadManager = new DownloadManager()
        Object.values( this.node.getElementsByClassName( 'save' ) ).forEach( b => b.addEventListener( 'click' , ( e ) => this[ 'export' + e.target.dataset.format ]()  ) )
    }

    exportpdf(){
        this.downloadManager.downloadPDF( document.getElementsByTagName( 'svg' )[ 0 ] )
    }

    exportpng(){
        this.downloadManager.downloadPNG( document.getElementsByTagName( 'svg' )[ 0 ] )
    }

    onEnterPage(){
        if( !window.posterUploaded ) this.emit( 'updateFlow' , { action : 'posterExport', data : 'svg' } )
        window.posterUploaded = true
    }
}

export { Save as default }