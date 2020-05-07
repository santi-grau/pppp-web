import Page from './../Page'

class Align extends Page{
    constructor( p ){
        super( p )

        this.scale = 1

        this.selectors = this.node.querySelectorAll( '.selector' )
        Object.values( this.selectors ).forEach( s => {
            s.addEventListener( 'click', ( e ) => this.selectAlign( e ) )
        })
    }

    selectAlign( e ){
        this.emit( 'updateFlow' , { action : 'alignUpdate', data : e.currentTarget.dataset.action } )
    }
}

export { Align as default }