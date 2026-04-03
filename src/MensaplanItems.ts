export class Meal {
	name: string;

	price_students: string;
	price_workers: string;
	price_guest: string;
	image_url: string;

	constructor(name: string, prices: string[], image_url: string) {
		this.name = name;
		this.price_students = prices[0].replace(",", ".");
		this.price_workers = prices[1].replace(",", ".");
		this.price_guest = prices[2].replace(",", ".");
		this.image_url = image_url;
	}

	to_markdown(): string {
		const image_format = `<img src="${this.image_url}" width="200"/>`;
		return `|${image_format}|${this.name}|${this.price_students}|${this.price_workers}|${this.price_guest}|`;
	}

	to_html() : string {
		const image_format = `<img src="${this.image_url}" width="200"/>`;
		return `<div class="meal">
			<div class="meal-image">${image_format}</div>
			<div class="meal-info">
				<div class="meal-name">${this.name}</div>
				<div class="meal-prices">
					<div class="price-students">Studenten: ${this.price_students}€</div>
					<div class="price-workers">Mitarbeiter: ${this.price_workers}€</div>
					<div class="price-guest">Gäste: ${this.price_guest}€</div>
				</div>
			</div>
		</div>`;
	}
}

export class Weekday {
	date: Date;
	suppen: Meal[];
	hauptspeisen: Meal[];
	beilagen: Meal[];
	nachspeisen: Meal[];
	abendgerichte: Meal[];

	constructor(date: Date) {
		this.date = date;
		this.suppen = [];
		this.hauptspeisen = [];
		this.beilagen = [];
		this.nachspeisen = [];
		this.abendgerichte = [];
	}

	public isEmpty(): boolean {
		return !(this.suppen.length > 0 ||
			this.hauptspeisen.length > 0 ||
			this.beilagen.length > 0 ||
			this.nachspeisen.length > 0 ||
			this.abendgerichte.length > 0);
	}

	add_meal(meal: Meal, meal_type: string) {
		switch (meal_type.toLowerCase()) {
			case "hauptgerichte":
				this.hauptspeisen.push(meal);
				break;
			case "beilagen":
				this.beilagen.push(meal);
				break;
			case "suppen":
				this.suppen.push(meal);
				break;
			case "nachspeisen":
				this.nachspeisen.push(meal);
				break;
			case "abendgerichte":
				this.abendgerichte.push(meal);
				break;
			default:
				throw new Error(`Unknown meal type: ${meal_type}`);
		}
	}

	get_markdown_table_header(): string {
		let res = "| Bilder | Name | Studentenpreis | Mitarbeiterpreis | Gästepreis |\n";
		res += "|--------|------|----------------|------------------|------------|\n";
		return res;
	}

	to_markdown_str(): string {
		let res = "";

		if (this.suppen.length > 0) {
			res += "## Suppen\n";
			res += this.get_markdown_table_header();
			for (const su of this.suppen) {
				res += `${su.to_markdown()}\n`;
			}
		}

		if (this.beilagen.length > 0) {
			res += "## Beilagen\n";
			res += this.get_markdown_table_header();
			for (const vs of this.beilagen) {
				res += `${vs.to_markdown()}\n`;
			}
		}
		if (this.hauptspeisen.length > 0) {
			res += "## Hauptspeisen\n";
			res += this.get_markdown_table_header();
			for (const hs of this.hauptspeisen) {
				res += `${hs.to_markdown()}\n`;
			}
		}

		if (this.nachspeisen.length > 0) {
			res += "## Nachspeisen\n";
			res += this.get_markdown_table_header();
			for (const ns of this.nachspeisen) {
				res += `${ns.to_markdown()}\n`;
			}
		}

		if (this.abendgerichte.length > 0) {
			res += "## Abengerichte\n";
			res += this.get_markdown_table_header();
			for (const ns of this.abendgerichte) {
				res += `${ns.to_markdown()}\n`;
			}
		}

		return res;
	}

	to_html_str(): string {
		let res = `<h2>${this.date.toLocaleDateString("de-DE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</h2>`;

		if (this.suppen.length > 0) {
			res += "<h3>Suppen</h3>";
			for (const su of this.suppen) {
				res += su.to_html();
			}
		}

		if (this.beilagen.length > 0) {
			res += "<h3>Beilagen</h3>";
			for (const vs of this.beilagen) {
				res += vs.to_html();
			}
		}
		if (this.hauptspeisen.length > 0) {
			res += "<h3>Hauptspeisen</h3>";
			for (const hs of this.hauptspeisen) {
				res += hs.to_html();
			}
		}

		if (this.nachspeisen.length > 0) {
			res += "<h3>Nachspeisen</h3>";
			for (const ns of this.nachspeisen) {
				res += ns.to_html();
			}
		}

		if (this.abendgerichte.length > 0) {
			res += "<h3>Abengerichte</h3>";
			for (const ns of this.abendgerichte) {
				res += ns.to_html();
			}
		}

		return res;
	}
}
