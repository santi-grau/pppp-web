import Page from './../Page'

class Font extends Page{
    constructor( p ){
        super( p )

        this.fontList = this.node.querySelectorAll( 'li' )
        Object.values( this.fontList ).forEach( f => {
            f.addEventListener( 'click', ( e ) => this.selectFont( e ) )
        })
    }

    selectFont( e ){
        this.node.querySelector( 'li.selected' ).classList.remove( 'selected' )
        e.currentTarget.classList.add( 'selected' )
        this.emit( 'updateFlow' , { action : 'fontUpdate', data : this.node.querySelector( 'li.selected' ).dataset.font } )
    }
}

export { Font as default }