const headElem = document.getElementById("head");
const buttonsElem = document.getElementById("buttons");
const pagesElem = document.getElementById("pages");
const element = document.getElementById("nizButton");

//Класс, который представляет сам тест
class Quiz
{
	constructor(type, questions, results)
	{
		//Тип теста: 1 - классический тест с правильными ответами, 2 - тест без правильных ответов
		this.type = type;

		//Массив с вопросами
		this.questions = questions;

		//Массив с возможными результатами
		this.results = results;

		//Количество набранных очков
		this.score = 0;

		//Номер результата из массива
		this.result = 0;

		//Номер текущего вопроса
		this.current = 0;
	}

	Click(index)
	{
		//Добавляем очки
		let value = this.questions[this.current].Click(index);
		this.score += value;

		let correct = -1;

		//Если было добавлено хотя одно очко, то считаем, что ответ верный
		if(value >= 1)
		{
			correct = index;
		}
		else
		{
			//Иначе ищем, какой ответ может быть правильным
			for(let i = 0; i < this.questions[this.current].answers.length; i++)
			{
				if(this.questions[this.current].answers[i].value >= 1)
				{
					correct = i;
					break;
				}
			}
		}

		this.Next();

		return correct;
	}

	//Переход к следующему вопросу
	Next()
	{
		this.current++;
		
		if(this.current >= this.questions.length) 
		{
			this.End();
		}
	}

	//Если вопросы кончились, этот метод проверит, какой результат получил пользователь
	End()
	{
		for(let i = 0; i < this.results.length; i++)
		{
			if(this.results[i].Check(this.score))
			{
				this.result = i;
			}
		}
	}
} 

//Класс, представляющий вопрос
class Question 
{
	constructor(text, answers)
	{
		this.text = text; 
		this.answers = answers; 
	}

	Click(index) 
	{
		return this.answers[index].value; 
	}
}

//Класс, представляющий ответ
class Answer 
{
	constructor(text, value) 
	{
		this.text = text; 
		this.value = value; 
	}
}

//Класс, представляющий результат
class Result 
{
	constructor(text, value)
	{
		this.text = text;
		this.value = value;
	}

	//Этот метод проверяет, достаточно ли очков набрал пользователь
	Check(value)
	{
		if(this.value <= value)
		{
			return true;
		}
		else 
		{
			return false;
		}
	}
}

//Массив с результатами
const results = 
[
	new Result("Вам многому нужно научиться, оценка 2", 0),
	new Result("Вы уже неплохо разбираетесь, оценка 3", 3),
	new Result("Ваш уровень выше среднего, оценка 4", 4),
	new Result("Вы в совершенстве знаете тему, оценка 5", 6)
];

//Массив с вопросами
const questions = 
[
	new Question("Какое значение display нужно установить для родительского элемента, чтобы разместить элементы &lt;article&gt; в виде flex блоков?", 
	[
		new Answer("flex", 1),
		new Answer("inline-flex", 0),
		new Answer("block", 0)
	]),

	new Question("Какие значения по умолчанию заданы для flex элементов?", 
	[
		new Answer("Колонки равных размеров по ширине и высоте", 1),
		new Answer("Строки равных размеров по ширине и высоте", 0),
		new Answer("Значения по умолчанию не заданы", 0)
	]),

	new Question("Какое значение display нужно установить для inline элементов, чтобы расставить их как flex блоки?", 
	[
		new Answer("flex", 0),
		new Answer("inline-flex", 1),
		new Answer("block", 0)
	]),

	new Question("Какой макет получится при использовании значения display: flex?", 
	[
		new Answer("2-х колоночный макет", 0),
		new Answer("3-х колоночный макет", 1),
		new Answer("4-х колоночный макет", 0)
	]),

	new Question("Какое значение display нужно установить для родительского элемента, чтобы расставить элементы в виде inline-flex блоков?", 
	[
		new Answer("flex", 0),
		new Answer("inline-flex", 1),
		new Answer("block", 0)
	]),

	new Question("Какое значение display нужно установить для родительского элемента, чтобы расставить элементы в виде block блоков?", 
	[
		new Answer("flex", 0),
		new Answer("inline-flex", 0),
		new Answer("block", 1)
	])
];

//Сам тест
const quiz = new Quiz(1, questions, results);


//Обновление теста
function Update()
{
	//Проверяем, есть ли ещё вопросы
	if(quiz.current < quiz.questions.length) 
	{
		//Если есть, меняем вопрос в заголовке
		headElem.innerHTML = quiz.questions[quiz.current].text;

		//Удаляем старые варианты ответов
		buttonsElem.innerHTML = "";

		//Создаём кнопки для новых вариантов ответов
        for (let i = 0; i < quiz.questions[quiz.current].answers.length; i++) {
            let label = document.createElement("label");
          
            let input = document.createElement("input");
            input.type = "radio";
            input.name = "answer";
            input.className = "button";
            input.value = i;
          
            let span = document.createElement("span");
          
            let p = document.createElement("p");
            p.innerHTML = quiz.questions[quiz.current].answers[i].text;
          
            label.appendChild(input);
            label.appendChild(span);
            label.appendChild(p);
          
            buttonsElem.appendChild(label);
            buttonsElem.appendChild(document.createElement("br"));
          }
		
		//Выводим номер текущего вопроса
		pagesElem.innerHTML = "Вопрос " + (quiz.current + 1) + " из " + quiz.questions.length;
	}
	else
	{
        const htmlCode = `
        <div class="result_block result_block_remove">
          <h1>Тест на тему: <br>
            “Размещение элементов в flexbox”</h1>
            `+"<p>" + quiz.results[quiz.result].text + "</p>"+`
          <p>`+ "<span>Итоги:</span>" + quiz.score + " из 6" + `</p>
          <div class="inputs_of_results">
            <input type="submit" value="Другие тесты" onclick="document.location='/tests.html'">
            <input type="submit" value="Следующий урок" onclick="document.location='/theory.html'">
          </div>
        </div>
      `;
        const outputElem = document.getElementById("output");
        outputElem.innerHTML = htmlCode;
		buttonsElem.innerHTML = "";
        element.innerHTML = "";
        element.remove();
		headElem.innerHTML = quiz.results[quiz.result].text;
	}
}

function Next()
{
	//Получаем выбранный ответ
	let selectedAnswer = document.querySelector('input[name="answer"]:checked');
	if (selectedAnswer) {
		let index = parseInt(selectedAnswer.value);
		let correct = quiz.Click(index);

		//Находим все кнопки
		let btns = document.getElementsByClassName("button");

		//Делаем кнопки серыми
		for(let i = 0; i < btns.length; i++)
		{
			btns[i].className = "button button_passive";
		}

		//Если это тест с правильными ответами, то мы подсвечиваем правильный ответ зелёным, а неправильный - красным
		if(quiz.type == 1)
		{
			if(correct >= 0)
			{
				btns[correct].className = "button button_correct";
			}

			if(index != correct) 
			{
				btns[index].className = "button button_wrong";
			} 
		}
		else
		{
			//Иначе просто подсвечиваем зелёным ответ пользователя
			btns[index].className = "button button_correct";
		}

		//Ждём секунду и обновляем тест
		setTimeout(Update, 100);
	}
}
