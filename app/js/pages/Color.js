import Page from './../Page'

class Color extends Page{
    constructor( p ){
        super( p )

        this.colorList = this.node.querySelectorAll( 'li' )
        Object.values( this.colorList ).forEach( f => {
            f.style.backgroundColor = f.dataset.background
            f.style.color = f.dataset.foreground
            f.addEventListener( 'click', ( e ) => this.selectColor( e ) )
        })
    }

    selectColor( e ){
        this.node.querySelector( 'li.selected' ).classList.remove( 'selected' )
        var font = e.currentTarget.dataset.font
        e.currentTarget.classList.add( 'selected' )
        this.emit( 'updateFlow' , { action : 'colorUpdate', data : e.currentTarget.dataset } )
    }
}

export { Color as default }