import Page from './../Page'

class Save extends Page{
    constructor( p ){
        super( p )
        Object.values( p.querySelectorAll( '.save' ) ).forEach( b => b.addEventListener( 'click', ( e ) => this.share( e ) ) )
    }

    onEnterPage(){
        if( !window.posterUploaded ) this.emit( 'updateFlow' , { action : 'posterExport', data : 'svg' } )
        window.posterUploaded = true
    }

    share( e ){
        console.log( e.target.dataset.format )
        this.emit( 'updateFlow' , { action : 'posterExport', data : e.target.dataset.format } )
    }
}

export { Save as default }