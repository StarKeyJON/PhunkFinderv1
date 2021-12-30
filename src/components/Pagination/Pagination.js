import React, { useState } from 'react';
import { CardGroup, Container } from 'react-bootstrap';
import './Pagination.css';

function Pagination({ data, RenderComponent, pageLimit, dataLimit }) {
    const [pages] = useState(Math.round(data.length / dataLimit));

    const [currentPage, setCurrentPage] = useState(1);

    function goToNextPage() {
        if (currentPage === pages - 1){
            setCurrentPage(currentPage)
        } else {
            setCurrentPage((page) => page + 1);
        }
    }

    function goToPreviousPage() {
        setCurrentPage((page) => page - 1);
    }

    function changePage(event) {
        const pageNumber = Number(event.target.textContent);
        if (Number(event.target.textContent) > pages) {
            setCurrentPage(1);
        } else {
            setCurrentPage(pageNumber);
        }
    }

    function getPaginatedData() {
        const startIndex = currentPage * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        return data.slice(startIndex, endIndex);
    };

    function goToPhirst(){
        setCurrentPage(1)
    };

    function goToLast () {
        setCurrentPage(pages)
    };

    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
        return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
    };

    return (
        <Container style={{ margin: '0 auto', marginTop: '10px', marginBottom: '5px' }}>

            {/* show the posts, 6 posts at a time */}
            <div className="dataContainer">

                    <CardGroup>
                        {getPaginatedData().map((d, idx) => (

                            <RenderComponent key={idx} data={d} />

                        ))}
                    </ CardGroup>

            </div>

            {/* show the pagination
            it consists of next and previous buttons
            along with page numbers
        */}
        <div className="container">
            <div className="pagination" style={{ margin: '0 auto', marginTop: '10px', marginBottom: '5px' }}>

                {/* previous button */}
                <button
                    onClick={goToPreviousPage}
                    className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
                >
                    prev
                </button>

                {/* show dots if there are pages behind to look through */}
                {currentPage > 1 ? (<button onClick={goToPhirst}>..</button>):(<div></div>)}

                {/* show page numbers */}
                {getPaginationGroup().map((item, index) => (
                    <button
                        key={index}
                        onClick={changePage}
                        className={`paginationItem ${currentPage === item ? 'active' : null}`}
                    >
                        <span>{item}</span>
                    </button>
                ))}

                {/* show dots if there are pages remaining to look through */}
                {pages > 0 ? (<button onClick={goToLast}>..</button>):(<div></div>)}

                {/* next button */}
                <button
                    onClick={goToNextPage}
                    className={`next ${currentPage === pages+1 ? 'disabled' : ''}`}
                >
                    next
                </button>

            </div>
        </div>

        </ Container>
    );
}

export default Pagination;
