import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowRestore } from '@fortawesome/free-solid-svg-icons';
// Or for Material Icons



export default function Home() {
  return (
    <>
    <h1 className='bg-yellow-200 font-semibold  mt-3 text-2xl m-5 p-3'>course Teching / Assessment</h1>

<table className='w-full p-5  border-separate rounded-md mt-2 border-slate-400'>
      <thead className='text-white '>
        <tr>

      <th className='px-2 py-2 font-semibold bg-black rounded-s-md'>
      
      </th>

          <th className='hidden lg:table-cell px-2 py-2 font-semibold bg-black'>Topics actually taught</th>
          <th className=' px-2 py-2 font-semibold bg-black'>Planned Hours</th>
          <th className='hidden md:table-cell px-2 py-2 font-semibold  bg-black'>Actual Hours</th>
          <th className='hidden md:table-cell px-2 py-2 font-semibold bg-black'>Remark</th>
          <th className='px-2 py-2 font-semibold bg-black rounded-e-md'>Learning Outcomes</th>
        </tr>
      </thead>
      <tbody className='text-center text-gray-500 divide-y'>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
          <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60'>1</td>
          <td title={"mohamed"} className='hidden lg:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate max-w-60'>Introduction to information security, Cryptography and Data Security</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate'>-</td>
          <td className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate  p-3'> <div className='flex justify-around items-center'>LO1,2 </div></td>
        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
          <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60'>2</td>
          <td title={"mohamed"} className='hidden lg:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate max-w-60'>2	Modular Arithmetic and Historical Ciphers	</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate'>-</td>
          <td className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate  p-3'> <div className='flex justify-around items-center'>LO1,2 </div></td>
        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
          <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60'>3</td>
          <td title={"mohamed"} className='hidden lg:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate max-w-60'>	Stream Ciphers, Random Numbers and the One Time Pad</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate'>-</td>
          <td className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate  p-3'> <div className='flex justify-around items-center'>LO1,2,5,6 </div></td>
        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
          <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60'>4</td>
          <td title={"mohamed"} className='hidden lg:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate max-w-60'>Stream Ciphers and Linear Feedback Shift Registers</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate'>-</td>
          <td className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate  p-3'> <div className='flex justify-around items-center'>LO1,2,4,6 </div></td>
        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
          <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60'>5</td>
          <td title={"mohamed"} className='hidden lg:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate max-w-60'>Data Encryption Standard (DES) - Encryption</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate'>-</td>
          <td className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate  p-3'> <div className='flex justify-around items-center'>LO1,4,6 </div></td>
        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
          <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60'>6</td>
          <td title={"mohamed"} className='hidden lg:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate max-w-60'>Data Encryption Standard (DES) - Key Schedule and Decryption</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate'>-</td>
          <td className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate  p-3'> <div className='flex justify-around items-center'>LO1,2,4,6 </div></td>
        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
          <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60'>7</td>
          <td title={"mohamed"} className='hidden lg:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate max-w-60'>	Midterm Exam</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate'>-</td>
          <td className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate  p-3'> <div className='flex justify-around items-center'>LO1,2,4,6 </div></td>
        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
          <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60'>8</td>
          <td title={"mohamed"} className='hidden lg:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate max-w-60'>Introduction to Galois Fields for the AES</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate'>-</td>
          <td className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate  p-3'> <div className='flex justify-around items-center'>LO2,3,5,6 </div></td>
        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
          <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60'>9</td>
          <td title={"mohamed"} className='hidden lg:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate max-w-60'>Advanced Encryption Standard (AES) </td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate'>-</td>
          <td className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate  p-3'> <div className='flex justify-around items-center'>LO3 </div></td>
        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
          <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60'>10</td>
          <td title={"mohamed"} className='hidden lg:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate max-w-60'>	Modes of Operation for Block Ciphers</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate'>-</td>
          <td className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate  p-3'> <div className='flex justify-around items-center'>LO3,4,6 </div></td>
        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
          <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60'>11</td>
          <td title={"mohamed"} className='hidden lg:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate max-w-60'>Multiple Encryption and Brute-Force Attacks</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate'>-</td>
          <td className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate  p-3'> <div className='flex justify-around items-center'>LO3,4,6 </div></td>
        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
          <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60'>12</td>
          <td title={"mohamed"} className='hidden lg:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate max-w-60'>Oral exam</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate'>-</td>
          <td className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate  p-3'> <div className='flex justify-around items-center'>LO3,4,6 </div></td>
        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
          <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60'>13</td>
          <td title={"mohamed"} className='hidden lg:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate max-w-60'>Introduction to Public-Key Cryptography</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate'>-</td>
          <td className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate  p-3'> <div className='flex justify-around items-center'>LO3,4,6 </div></td>
        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
          <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60'>14</td>
          <td title={"mohamed"} className='hidden lg:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate max-w-60'>	The RSA Cryptosystem and Efficient Exponentiation	</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate'>-</td>
          <td className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate  p-3'> <div className='flex justify-around items-center'>LO3,4,6 </div></td>
        </tr>


      </tbody>

</table>
<div className='m-5 bg-white p-5'>
  <h1 className='bg-yellow-200 font-semibold p-2 mt-3 text-2xl m-5'>1- statistics</h1>
  <h2 className='text-red-500  mt-2'>Group No.:7532</h2>
  <h2 className='text-red-500  mt-2' >Number of students starting the course: 49</h2>
  <h2 className='text-red-500  mt-2'>Number of students completing the course: 49</h2> 
  <h2 className='text-red-500  mt-2'>Students Grades at the end of the course</h2> 
  <h2 className='text-red-500  mt-2'>Number of passed students: 42  </h2> 
  <h2 className='text-red-500  mt-2'>Number of failed students: 4  </h2> 
</div>
<h1 className='bg-yellow-200 font-semibold  mt-3 text-2xl m-5 p-3'>Grading of passed students:</h1>

<table className='w-full p-5  border-separate rounded-md mt-10 mb-20 border-slate-400'>
      <thead className='text-white '>
        <tr>

      <th className='px-2 py-2 font-semibold bg-black rounded-s-md'>
        Grade
      
      </th>

          <th className='hidden lg:table-cell px-2 py-2 font-semibold bg-red-600'>A+</th>
          <th className=' px-2 py-2 font-semibold bg-red-600'>A</th>
          <th className='hidden md:table-cell px-2 py-2 font-semibold  bg-red-600'>A-</th>
          <th className='hidden md:table-cell px-2 py-2 font-semibold bg-red-600'>B+</th>
          <th className='hidden md:table-cell px-2 py-2 font-semibold bg-red-600'>B</th>
          <th className='px-2 py-2 font-semibold bg-red-600 rounded-e-md'>B-</th>
          <th className='px-2 py-2 font-semibold  bg-red-600 rounded-e-md'>C+</th>
          <th className='px-2 py-2 font-semibold  bg-red-600 rounded-e-md'>C</th>
          <th className='px-2 py-2 font-semibold  bg-red-600 rounded-e-md'>C-</th>
          <th className='px-2 py-2 font-semibold  bg-red-600 rounded-e-md'>D+</th>
          <th className='px-2 py-2 font-semibold  bg-red-600 rounded-e-md'>D</th>
          <th className='px-2 py-2 font-semibold  bg-red-600 rounded-e-md'>f</th>
        </tr>
      </thead>
      <tbody className='text-center text-gray-500 divide-y'>
       
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60'>no</td>

          <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60'>0</td>
          <td title={"mohamed"} className='hidden lg:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate max-w-60'>0</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate '>0</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate '>5</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate'>13</td>
          <td className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate  p-3'> <div className='flex justify-around items-center'>9</div></td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>6</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>2</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>3</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>3</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>1</td>
          <td className='hidden md:table-cell py-3 font-medium border whitespace-nowrap border-slate-300 truncate  text-red-600'>4</td>






        </tr>
       


      </tbody>

</table>
<h1 className='bg-yellow-200 font-semibold  mt-3 text-2xl m-5 p-3'>Achievement of Course Learning Outcomes and Competences:</h1>
<table className='w-full p-5 border-separate rounded-md mt-20 mb-20 border-slate-400'>
      <thead className='text-white '>
        <tr>

      

          <th className='hidden lg:table-cell px-2 py-2 font-semibold bg-red-600'>LOs NARS</th>
          <th className=' px-2 py-2 font-semibold bg-red-600'>A6</th>
          <th className='hidden md:table-cell px-2 py-2 font-semibold  bg-red-600'>B2</th>
          <th className='hidden md:table-cell px-2 py-2 font-semibold bg-red-600'>C2</th>
          
        </tr>
      </thead>
      <tbody className='text-center text-gray-500 divide-y'>
       
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
        <td title={"id"} colSpan={4}  className=' py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>Congnitive Domain</td>
        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>LO1</td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>-</td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>-</td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>-</td>



        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>LO2</td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>-</td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>-</td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '></td>

        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>LO3</td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>-</td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '></td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '></td>

        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>LO4</td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '></td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>-</td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '></td>

        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
        <td title={"id"} colSpan={4}  className=' py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>Psychomotor Domain</td>
        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 bg-slate-400 '></td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 bg-slate-400 '></td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 bg-slate-400 '></td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 bg-slate-400 '></td>

        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
        <td title={"id"} colSpan={4}  className=' py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>Affective Domain</td>
        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>LO5</td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>-</td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '></td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '></td>

        </tr>
        <tr className='bg-white dark:border-gray-700 hover:bg-blue-200'>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>LO6</td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '></td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '></td>
        <td title={"id"} className='py-3 font-medium border whitespace-nowrap border-slate-300 truncate text-balance max-w-60 '>-</td>

        </tr>


       


      </tbody>

</table>
</>
   
  );
}
