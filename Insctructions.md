Du skall i denna uppgift bygga en mini-reddit klon med hjälp av posts, users, och comments från DummyJSON för att implementera funktionalitet. Det är helt okej att använda Reddits riktiga API, om du vill försöka få det att fungera. Spendera dock ingen större tid på att felsöka det, om det skulle uppstå problem; fokusera och använd isåfall DummyJSON istället.


Inlägg och kommentarer skall laddas in från API:et, så fort webbsidan laddas in. Dessa inlägg och kommentarer skall sparas i localStorage. Om det redan finns saker i localStorage skall dessa användas och API:et skall inte anropas.


Applikationen (webbsidan) ska innehålla en huvudsida med alla inlägg (posts). Dessa inlägg skall komma från API:et eller localStorage. Inlägg på huvudsidan ska visa:

    Titel
    En del av innehållet (max 60 tecken) (kallad body i API:et)
    Taggar
    Namn på skaparen (användaren)


På huvudsidan skall man kunna skapa nya inlägg:

    Implementera detta genom att välja vilken användare som ska skapa inlägget. Detta är inte realistiskt och inte hur Reddit egentligen fungerar eftersom man vanligtvis är inloggad på en användare, men för uppgiftens omfattning skall det fungera så. Vid skapandet av inlägget ska man alltså få välja vilken användare (utav de som API:et innehåller) som skapar inlägget
    Nya inlägg skall sparas i localStorage


Man skall även kunna trycka på ett inlägg vilket skickar en till en "ny" sida som visar hela inlägget. Detta kan implementeras på olika sätt, exempelvis genom ett separat HTML dokument. På denna sida ska följande visas:

    Titel
    Hela innehållet (kallad body i API:et)
    Taggar
    Namn på skaparen (användaren)
    Antal reaktioner (kallad reactions i API:et)
    Kommentarer, som består av dess innehåll (också kallad body i API:et) samt namnet på skaparen (användaren) av kommentaren


På (inlägg-)sidan skall också följande vara möjligt:

    Skriva ny kommentar på inlägget (som också skall sparas i localStorage)
    Reagera på inlägget (likes, dislikes, reactions, och detta skall också sparas i localStorage)


Övrig information:

    API objekten innehåller all information du kan behöva
    Nya användare kan inte skapas. De som kommer från API:et är alla som ska finnas
    Det finns ingen "inloggning"