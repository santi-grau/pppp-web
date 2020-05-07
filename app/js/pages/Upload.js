import Page from './../Page'

class Upload extends Page{
    constructor( p ){
        super( p )
        this.node.querySelector( '#uploadBut' ).addEventListener( 'click', ( e ) => {
            var zipcode = this.node.querySelector( 'input[name=zipcode]' ).value 
            var country = this.node.querySelector( 'input[name=country]' ).value
            this.emit( 'updateFlow' , { action : 'posterExport', data : 'svg', meta : zipcode + ',' + country } )
            window.posterUploaded = true
            this.emit( 'updateFlow' , { action : 'navigateForward' } )
        } )
    }
}

export { Upload as default }