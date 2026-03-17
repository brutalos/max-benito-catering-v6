import React from 'react';

export default function LegalPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <section id="legal">
        <div className="row">
          <h1 className="text-[33px] font-medium uc mb-8">Impressum</h1>

          <div className="space-y-6 text-[18px]">
            <p>
              CALIMEX GmbH<br />
              Mariahilfer Straße 4/6, A—1070&nbsp;Wien<br />
              <a href="mailto:office@maxbenito.at" className="hover:text-accent transition-colors">office@maxbenito.at</a>
            </p>

            <p>
              FN: 428908y, Handelsgericht&nbsp;Wien<br />
              UID-Nummer: ATU69365215<br />
              Kammerzugehörigkeit: Wirtschaftskammer&nbsp;Wien,<br />
              Fachgruppe&nbsp;Gastronomie
            </p>

            <div>
              <h2 className="text-[28px] font-medium uc mb-4 mt-8">Anzuwendende Rechtsvorschriften (u.a.):</h2>
              <p>
                Gewerbeordnung (einsehbar unter <a href="https://www.ris.bka.gv.at" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">www.ris.bka.gv.at</a>)<br />
                Zuständige Gewerbebehörde: Magistrat der Stadt Wien, MBA 1/8
              </p>
            </div>

            <div>
              <h2 className="text-[28px] font-medium uc mb-4 mt-8">Haftungsausschluss</h2>
              <p>
                Die CALIMEX GmbH übernimmt keine Verantwortung für die<br className="hidden md:block" />
                Inhalte von externen Websites, die über Links von dieser<br className="hidden md:block" />
                Website erreicht werden können oder die ihrerseits auf diese<br className="hidden md:block" />
                Website verweisen und übernimmt keinerlei Verantwortung<br className="hidden md:block" />
                für den Inhalt solcher Websites oder deren Richtigkeit,<br className="hidden md:block" />
                Vollständigkeit oder Gesetzeskonformität.<br className="hidden md:block" />
                Für Inhalte übernehmen wir keine Gewähr. Preisänderungen<br className="hidden md:block" />
                vorbehalten. Copyright 2026 by CALIMEX GmbH.
              </p>
            </div>

            <div>
              <h2 className="text-[28px] font-medium uc mb-4 mt-8">Gestaltung Corporate Design &amp; Website</h2>
              <p>
                <a target="_blank" href="https://www.graphicsociety.at" rel="noopener noreferrer" className="hover:text-accent transition-colors">www.graphicsociety.at</a>
              </p>
            </div>

            <div>
              <h2 className="text-[28px] font-medium uc mb-4 mt-8">Programmierung</h2>
              <p>
                <a target="_blank" href="https://www.emanuel-pesendorfer.at" rel="noopener noreferrer" className="hover:text-accent transition-colors">www.emanuel-pesendorfer.at</a>
              </p>
            </div>

            <h1 className="text-[33px] font-medium uc pt-16 mb-8">DATENSCHUTZ</h1>

            <div>
              <h2 className="text-[28px] font-medium uc mb-4 mt-8">ERKLÄRUNG ZUR INFORMATIONSPFLICHT</h2>
              <p>
                Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003). In diesen Datenschutzinformationen informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Website.
              </p>
            </div>

            <div>
              <h2 className="text-[28px] font-medium uc mb-4 mt-8">KONTAKT MIT UNS</h2>
              <p>
                Wenn Sie per Formular auf der Website oder per E-Mail Kontakt mit uns aufnehmen, werden Ihre angegebenen Daten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen sechs Monate bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
              </p>
            </div>

            <div>
              <h2 className="text-[28px] font-medium uc mb-4 mt-8">SO KÖNNEN SIE UNS ERREICHEN: </h2>
              <p>
                CALIMEX GmbH<br />
                Mariahilferstraße 4<br />
                A-1070 Wien<br />
                0660 846 281 4<br />
                <a href="mailto:office@maxbenito.at" className="hover:text-accent transition-colors">office@maxbenito.at</a>
              </p>
            </div>

            <div>
              <h2 className="text-[28px] font-medium uc mb-4 mt-8">IHRE RECHTE</h2>
              <p>
                Ihnen stehen bezüglich Ihrer bei uns gespeicherten Daten grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und Widerspruch zu. Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt oder Ihre datenschutzrechtlichen Ansprüche sonst in einer Weise verletzt worden sind, können Sie sich bei uns <a href="mailto:office@maxbenito.at" className="hover:text-accent transition-colors">office@maxbenito.at</a> oder der Datenschutzbehörde beschweren.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="flex justify-center mt-32 mb-16">
        <img 
          src="/images/logo-mini.svg" 
          alt="Max & Benito Logo mini" 
          className="hidden md:block w-[70px] opacity-10" 
        />
      </div>
    </div>
  );
}
